import { PipelineStage, Types } from 'mongoose';
import { CustomJwtPayload, Pagination } from '@/api/v1/interfaces';
import { AnalyticsModel, ShortURLModel } from '@/api/v1/models';
import { ValidationError } from '@/api/v1/utils/errors';

/**
 * Resultado de la agregación de métricas
 */
interface MetricsAgg {
  _id: string;
  topReferrer: string;
  topDevice: string;
  topCountry: string;
  lastClickAt?: Date;
}

/**
 * Tipo para filtrar por shortUrl(s) en agregaciones
 */
type ShortUrlFilter = Record<string, unknown>;

/**
 * Utilidad para obtener métricas básicas para shortURLs específicas
 * @param shortUrlFilter - Filtro de shortUrl(s)
 * @returns Métricas agrupadas por día y shortUrl
 */
const getOLDmetrics = async (shortUrlFilter: ShortUrlFilter) => {
  return await AnalyticsModel.aggregate<MetricsAgg>([
    { $match: shortUrlFilter },
    {
      $group: {
        _id: {
          shortUrl: '$shortUrl',
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        },
        topReferrer: { $first: '$referrer' },
        topDevice: { $first: '$deviceType' },
        topCountry: { $first: '$country' },
      },
    },
  ]);
};

/**
 * Devuelve la analítica de una shortUrl concreta del usuario autenticado.
 *
 * @param user - Usuario autenticado
 * @param shortCode - Identificador corto de la URL
 * @returns Datos completos de la URL con sus métricas asociadas
 * @throws {ValidationError} Si la URL no existe o no pertenece al usuario
 */
const getShortUrlAnalytics = async (
  user: CustomJwtPayload,
  shortCode: string
) => {
  // Busca el shortCode del usuario
  const shortURL = await ShortURLModel.findOne({
    shortCode,
    user: user.id,
  });
  if (!shortURL) {
    throw new ValidationError('Short URL not found or not owned by user');
  }

  const metricsArr = await getOLDmetrics({ shortUrl: shortURL._id });
  const metricsData = metricsArr[0] ?? {};

  return {
    shortCode: shortURL.shortCode,
    url: shortURL.url,
    title: shortURL.title,
    logo: shortURL.logo,
    description: shortURL.description,
    createdAt: shortURL.createdAt,
    totalClicks: shortURL.totalClicks,
    metrics: {
      totalClicks: shortURL.totalClicks,
      lastClickAt: metricsData.lastClickAt,
      topReferrer: metricsData.topReferrer,
      topDevice: metricsData.topDevice,
      topCountry: metricsData.topCountry,
    },
  };
};

/**
 * Resultado de los clicks diarios con detalle opcional de URLs
 */
interface DailyClickResult {
  /** Fecha en formato YYYY-MM-DD */
  date: string;
  /** Número total de clicks en la fecha */
  clicks: number;
  /** URLs con sus clicks específicos en la fecha (opcional) */
  urls?: Array<{
    shortCode: string;
    url: string;
    clicks: number;
  }>;
}

/**
 * Opciones para filtrar y paginar los clicks diarios
 */
interface DailyClicksOptions {
  days?: number;
  order?: 'asc' | 'desc';
  includeUrls?: boolean;
  limit?: number;
  page?: number;
}

/**
 * Obtiene los clicks diarios de todas las URLs del usuario, con posibilidad de incluir desglose por URL
 *
 * @param user - Usuario autenticado
 * @param options - Opciones de filtrado y paginación
 * @returns Datos paginados de clicks diarios
 * @throws {ValidationError} Si no hay usuario autenticado
 */
const getDailyClicks = async (
  user: CustomJwtPayload,
  options: DailyClicksOptions = {}
): Promise<Pagination<DailyClickResult>> => {
  // Validación del usuario
  if (!user?.id) {
    throw new ValidationError('No user authenticated');
  }

  // Configuración por defecto, 30 días, orden ascendente, sin URLs, 30 resultados por página, página 1
  const {
    days = 30,
    order = 'asc',
    includeUrls = false,
    limit = 30,
    page = 1,
  } = options;

  // Validar parámetros
  const validatedLimit = Math.min(Math.max(1, limit), 50); // Máximo 50 días por petición
  const validatedPage = Math.max(1, page);

  // Calcular fecha de inicio
  const startDate =
    days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

  //obtener IDs de las URLs del usuario
  const urlIds = await ShortURLModel.distinct('_id', { user: user.id });
  if (!urlIds.length) {
    return {
      data: [],
      pagination: {
        total: 0,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: 0,
      },
    };
  }

  // Pipeline base - matchea las IDs de las URLs y la fecha de inicio si se proporciona
  const pipeline: PipelineStage[] = [
    {
      $match: {
        shortUrl: { $in: urlIds },
        ...(startDate && { timestamp: { $gte: startDate } }),
      },
    },
  ];

  // Agregación común
  if (includeUrls) {
    pipeline.push(
      {
        $lookup: {
          from: 'shorturls',
          localField: 'shortUrl',
          foreignField: '_id',
          as: 'urlDetails',
        },
      },
      { $unwind: '$urlDetails' },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            shortCode: '$urlDetails.shortCode',
          },
          clicks: { $sum: 1 },
          originalUrl: { $first: '$urlDetails.url' },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          date: { $first: '$_id.day' },
          totalClicks: { $sum: '$clicks' },
          urls: {
            $push: {
              shortCode: '$_id.shortCode',
              url: '$originalUrl',
              clicks: '$clicks',
            },
          },
        },
      }
    );
  } else {
    pipeline.push({
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        },
        clicks: { $sum: 1 },
      },
    });
  }

  // Pipeline para contar el total de días (para paginación)
  const countPipeline = [
    ...pipeline,
    { $group: { _id: null, count: { $sum: 1 } } },
  ];

  // Obtener el total de días primero - obtenemos el primer resultado del array devuelto por countPipeline
  const [countResult] = await AnalyticsModel.aggregate<{ count: number }>(
    countPipeline
  );
  const totalDays = countResult?.count || 0;

  // Completar pipeline para obtener datos
  pipeline.push(
    {
      $project: {
        _id: 0,
        date: includeUrls ? '$_id' : '$_id.day',
        clicks: includeUrls ? '$totalClicks' : '$clicks',
        ...(includeUrls && { urls: 1 }),
      },
    },
    { $sort: { date: order === 'asc' ? 1 : -1 } },
    { $skip: (validatedPage - 1) * validatedLimit },
    { $limit: validatedLimit }
  );

  const data = await AnalyticsModel.aggregate<DailyClickResult>(pipeline);

  return {
    data,
    pagination: {
      total: totalDays,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(totalDays / validatedLimit),
    },
  };
};

/**
 * Obtiene los clicks agrupados por día para una URL específica
 *
 * @param user - Usuario autenticado
 * @param shortUrl - Identificador corto de la URL
 * @returns Datos de clicks por día o null si la URL no existe o no pertenece al usuario
 */
const getShortUrlClicksByDay = async (
  user: CustomJwtPayload,
  shortCode: string
) => {
  // Busca la shortURL del usuario
  const urlDoc = await ShortURLModel.findOne({
    shortCode,
    user: user.id,
  });
  if (!urlDoc) return null;
  // Obtiene los clicks por día para esa shortUrl
  const clicksByDay = await getOLDmetrics({ shortUrl: urlDoc._id });
  return clicksByDay;
};

/**
 * Opciones para filtrar y paginar las analíticas de URLs
 */
interface AnalyticsOptions {
  dailyClicks?: boolean;
  limit?: number;
  sortBy?: 'totalClicks' | 'createdAt' | 'lastClickedAt';
  order?: 'asc' | 'desc';
  page?: number;
}

/**
 * Estadísticas diarias de una URL
 */
interface DailyStat {
  date: string;
  clicks: number;
  referrers?: string[];
  devices?: string[];
}

/**
 * Métricas de una URL específica
 */
interface UrlMetrics {
  _id?: Types.ObjectId;
  totalClicks?: number;
  lastClickAt?: Date;
  topReferrer?: string;
  topDevice?: string;
  topCountry?: string;
  dailyStats?: DailyStat[];
}

/**
 * URL con sus métricas asociadas para devolver al cliente
 */
interface UrlWithMetrics {
  shortCode: string;
  url: string;
  title?: string;
  createdAt: Date;
  metrics: Omit<UrlMetrics, '_id'>;
}

/**
 * Obtiene todas las URLs del usuario con sus métricas asociadas, paginadas y ordenadas
 *
 * @param user - Usuario autenticado
 * @param options - Opciones de filtrado, ordenación y paginación
 * @returns Datos paginados de URLs con sus métricas
 * @throws {ValidationError} Si no hay usuario autenticado
 */
export const getAnalytics = async (
  user: CustomJwtPayload,
  options: AnalyticsOptions = {}
): Promise<Pagination<UrlWithMetrics>> => {
  if (!user?.id) {
    throw new ValidationError('No user authenticated');
  }

  const {
    dailyClicks = false,
    limit = 50,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
  } = options;

  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(100, limit);

  // obtener las urls
  // 1. Obtener URLs paginadas con conteo total
  const [urls, totalUrls] = await Promise.all([
    ShortURLModel.find({ user: user.id })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit)
      .lean(),
    ShortURLModel.countDocuments({ user: user.id }),
  ]);

  if (!urls.length)
    return {
      data: [],
      pagination: {
        total: 0,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: 0,
      },
    };

  const urlIds = urls.map((u) => u._id);
  // obtener analytics por shortUrl
  // const pipeline2: PipelineStage[] = [
  //   { $match: { shortUrl: { $in: urlIds } } },
  //   {
  //     $group: {
  //       _id: '$shortUrl',
  //       lastClickAt: { $max: '$timestamp' },
  //       topReferrer: { $first: '$referrer' },
  //       topDevice: { $first: '$deviceType' },
  //       topCountry: { $first: '$country' },
  //       // Solo agrupar por día si dailyClicks=true
  //       ...(dailyClicks && {
  //         dailyStats: {
  //           $push: {
  //             date: {
  //               $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
  //             },
  //             clicks: 1, // Cada documento representa 1 click
  //             referrer: '$referrer',
  //             device: '$deviceType'
  //           }
  //         }
  //       })
  //     }
  //   }
  // ];

  const pipeline: PipelineStage[] = [
    { $match: { shortUrl: { $in: urlIds } } },

    // Primero: Descomponer y contar frecuencias por shortUrl
    {
      $facet: {
        // Pipeline para topReferrer
        topReferrer: [
          { $match: { referrer: { $ne: '' } } }, // Ignorar referrers vacíos
          {
            $group: {
              _id: { shortUrl: '$shortUrl', referrer: '$referrer' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.shortUrl': 1, count: -1 } },
          {
            $group: {
              _id: '$_id.shortUrl',
              topReferrer: { $first: '$_id.referrer' },
              referrerCount: { $first: '$count' },
            },
          },
        ],

        // Pipeline para topDevice
        topDevice: [
          {
            $group: {
              _id: { shortUrl: '$shortUrl', device: '$deviceType' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.shortUrl': 1, count: -1 } },
          {
            $group: {
              _id: '$_id.shortUrl',
              topDevice: { $first: '$_id.device' },
              deviceCount: { $first: '$count' },
            },
          },
        ],

        // Pipeline para topCountry
        topCountry: [
          {
            $group: {
              _id: { shortUrl: '$shortUrl', country: '$country' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.shortUrl': 1, count: -1 } },
          {
            $group: {
              _id: '$_id.shortUrl',
              topCountry: { $first: '$_id.country' },
              countryCount: { $first: '$count' },
            },
          },
        ],

        // Pipeline para datos base (lastClickAt, etc.)
        baseData: [
          {
            $group: {
              _id: '$shortUrl',
              lastClickAt: { $max: '$timestamp' },
              totalClicks: { $sum: 1 },
              ...(dailyClicks && {
                dailyStats: {
                  $push: {
                    date: {
                      $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
                    },
                    clicks: 1,
                  },
                },
              }),
            },
          },
        ],
      },
    },

    // Segundo: Unir los resultados de los sub-pipelines
    {
      $project: {
        mergedData: {
          $map: {
            input: '$baseData',
            as: 'base',
            in: {
              $mergeObjects: [
                '$$base',
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$topReferrer',
                        as: 'ref',
                        cond: { $eq: ['$$ref._id', '$$base._id'] },
                      },
                    },
                    0,
                  ],
                },
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$topDevice',
                        as: 'dev',
                        cond: { $eq: ['$$dev._id', '$$base._id'] },
                      },
                    },
                    0,
                  ],
                },
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$topCountry',
                        as: 'ctry',
                        cond: { $eq: ['$$ctry._id', '$$base._id'] },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    },

    // Tercero: Aplanar y limpiar la estructura
    { $unwind: '$mergedData' },
    {
      $replaceRoot: { newRoot: '$mergedData' },
    },
  ];

  if (dailyClicks) {
    pipeline.push({
      $addFields: {
        dailyStats: {
          $reduce: {
            input: '$dailyStats',
            initialValue: [],
            in: {
              $concatArrays: [
                '$$value',
                {
                  $cond: [
                    {
                      $in: ['$$this.date', '$$value.date'],
                    },
                    [],
                    [
                      {
                        date: '$$this.date',
                        clicks: {
                          $size: {
                            $filter: {
                              input: '$dailyStats',
                              as: 'day',
                              cond: { $eq: ['$$day.date', '$$this.date'] },
                            },
                          },
                        },
                        referrers: {
                          $map: {
                            input: {
                              $filter: {
                                input: '$dailyStats',
                                as: 'day',
                                cond: { $eq: ['$$day.date', '$$this.date'] },
                              },
                            },
                            as: 'day',
                            in: '$$day.referrer',
                          },
                        },
                      },
                    ],
                  ],
                },
              ],
            },
          },
        },
      },
    });
  }

  const metricsData = await AnalyticsModel.aggregate<UrlMetrics>(pipeline);

  const data = urls.map((url) => {
    // busca metricas, si no las encuentra, crea un objeto vacío
    const urlMetrics =
      metricsData.find((m) => m._id?.toString() === url._id.toString()) ?? {};

    // Construir respuesta
    const result: UrlWithMetrics = {
      shortCode: url.shortCode,
      url: url.url,
      title: url.title,
      createdAt: url.createdAt,
      metrics: {
        totalClicks: url.totalClicks,
        lastClickAt: urlMetrics.lastClickAt,
        topReferrer: urlMetrics.topReferrer,
        topDevice: urlMetrics.topDevice,
        topCountry: urlMetrics.topCountry,
        ...(options.dailyClicks && { dailyStats: urlMetrics.dailyStats }),
      },
    };

    return result;
  });

  return {
    data,
    pagination: {
      total: totalUrls,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(totalUrls / validatedLimit),
    },
  };
};

/**
 * Métrica con nombre y contador para rankings
 */
interface TopMetric {
  name: string;
  count: number;
}

/**
 * Métricas globales de un usuario
 */
interface UserGlobalMetrics {
  totalClicks: number;
  totalShortUrls: number;
  topCountries: TopMetric[];
  topCities: TopMetric[];
  topBrowsers: TopMetric[];
  topDeviceTypes: TopMetric[];
  topOperatingSystems: TopMetric[];
  topReferrers: TopMetric[];
  weekAvgClicks: number;
  monthAvgClicks: number;
  trend: number | null;
  weekShortUrls: number;
  monthAvgShortUrls: number;
  trendShortUrls: number | null;
}

/**
 * Obtiene métricas globales y tendencias para un usuario
 *
 * @param user - Usuario autenticado
 * @returns Métricas globales incluyendo totales, rankings y tendencias
 * @throws {ValidationError} Si no hay usuario autenticado
 */
// TODO: Refactorizar
const getUserGlobalMetrics = async (
  user: CustomJwtPayload
): Promise<UserGlobalMetrics> => {
  const urlIds = await ShortURLModel.distinct('_id', { user: user.id });

  const [agg] = await AnalyticsModel.aggregate<{
    totalClicks: number;
    topCountries: string[];
    topCities: string[];
    topBrowsers: string[];
    topDeviceTypes: string[];
    topOperatingSystems: string[];
    topReferrers: string[];
  }>([
    { $match: { shortUrl: { $in: urlIds } } },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        topCountries: { $push: '$country' },
        topCities: { $push: '$city' },
        topBrowsers: { $push: '$browser' },
        topDeviceTypes: { $push: '$deviceType' },
        topOperatingSystems: { $push: '$operatingSystem' },
        topReferrers: { $push: '$referrer' },
      },
    },
  ]);

  const totalShortUrls = urlIds.length;

  // INFO: Utilidad: Procesar top países, ciudades, browsers, deviceTypes, operatingSystems, referrers
  const countBy = (arr: string[] = []): TopMetric[] =>
    Object.entries(
      arr.filter(Boolean).reduce(
        (acc, v) => {
          acc[v] = (acc[v] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    )
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

  //  Tendencias: clicks de la semana y media diaria del mes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 30);

  // Clicks de la semana (últimos 7 días)
  const [weekAgg] = await AnalyticsModel.aggregate<{ count: number }>([
    { $match: { shortUrl: { $in: urlIds }, timestamp: { $gte: weekAgo } } },
    { $count: 'count' },
  ]);
  const weekClicks = weekAgg?.count || 0;
  const weekAvgClicks = weekClicks / 7;

  // Clicks del mes (últimos 30 días)
  const [monthAgg] = await AnalyticsModel.aggregate<{ count: number }>([
    {
      $match: {
        shortUrl: { $in: urlIds },
        timestamp: { $gte: monthAgo, $lt: weekAgo },
      },
    },
    { $count: 'count' },
  ]);
  const monthClicks = monthAgg?.count || 0;
  const monthAvgClicks = monthClicks / 30;

  // Tendencia: comparación de la semana vs media diaria del mes anterior
  const trend =
    monthAvgClicks > 0
      ? ((weekAvgClicks - monthAvgClicks) / monthAvgClicks) * 100
      : null;

  // ShortUrls creadas en la última semana y mes
  const [weekShortUrls, monthShortUrls] = await Promise.all([
    ShortURLModel.countDocuments({
      user: user.id,
      createdAt: { $gte: weekAgo },
    }),
    ShortURLModel.countDocuments({
      user: user.id,
      createdAt: { $gte: monthAgo, $lt: weekAgo },
    }),
  ]);

  const weekAvgShortUrls = weekShortUrls / 7;
  const monthAvgShortUrls = monthShortUrls / 30;
  let trendShortUrls: number | null;
  if (monthAvgShortUrls <= 0) {
    trendShortUrls = weekShortUrls > 0 ? 100 * weekShortUrls : 0;
  } else {
    trendShortUrls =
      ((weekAvgShortUrls - monthAvgShortUrls) / monthAvgShortUrls) * 100;
  }

  return {
    totalClicks: agg?.totalClicks || 0,
    totalShortUrls,
    topCountries: countBy(agg?.topCountries),
    topCities: countBy(agg?.topCities),
    topBrowsers: countBy(agg?.topBrowsers),
    topDeviceTypes: countBy(agg?.topDeviceTypes),
    topOperatingSystems: countBy(agg?.topOperatingSystems),
    topReferrers: countBy(agg?.topReferrers),
    weekAvgClicks: Math.round(weekAvgClicks),
    monthAvgClicks: Math.round(monthAvgClicks),
    trend,
    weekShortUrls,
    monthAvgShortUrls,
    trendShortUrls: Math.round(trendShortUrls ?? 0),
  };
};

export default {
  getShortUrlAnalytics,
  getDailyClicks,
  getShortUrlClicksByDay,
  getAnalytics,
  getUserGlobalMetrics,
};
