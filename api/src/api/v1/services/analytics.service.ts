import { CustomJwtPayload } from '@/api/v1/interfaces';
import { AnalyticsModel, ShortURLModel } from '@/api/v1/models';
import { ValidationError } from '@/api/v1/utils/errors';
import { PipelineStage, Types } from 'mongoose';

// interface ClickByDay {
//   date: string;
//   clicks: number;
// }

interface MetricsAgg {
  _id: string;
  topReferrer: string;
  topDevice: string;
  topCountry: string;
  lastClickAt?: Date;
}

// Utilidad para obtener clicks por día dado un filtro de shortUrl(s)
type ShortUrlFilter = Record<string, unknown>;
const getOLDmetrics = async (shortUrlFilter: ShortUrlFilter) => {
  return AnalyticsModel.aggregate<MetricsAgg>([
    { $match: shortUrlFilter },
    {
      $group: {
        _id: {
          shortUrl: '$shortUrl',
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        topReferrer: { $first: '$referrer' },
        topDevice: { $first: '$deviceType' },
        topCountry: { $first: '$country' }
      }
    }
  ]);
};

/**
 * Obtiene todas las URLs acortadas y analíticas para un usuario.
 * Incluye clicks por día usando la colección de analytics.
 * @param user El usuario autenticado
 * @returns Lista de URLs con analíticas
 */
// usar getDailyClicks  con includeUrls = true
// export const OLDgetUserAnalytics = async (user: CustomJwtPayload) => {
//   const urls = await ShortURLModel.find({ user: user.id })
//     .select(
//       'shortURL url title logo description createdAt updatedAt totalClicks'
//     )
//     .sort({ createdAt: -1 });

//   const urlIds = urls.map((url) => url._id);
//   const analyticsByUrl = await getOLDmetrics({ shortUrl: { $in: urlIds } });
//   const analyticsMap = new Map<string, ClickByDay[]>(
//     analyticsByUrl.map((a) => [a._id.toString(), a.clicksByDay])
//   );

//   return urls.map((url) => ({
//     shortURL: url.shortURL,
//     url: url.url,
//     title: url.title,
//     logo: url.logo,
//     description: url.description,
//     createdAt: url.createdAt,
//     totalClicks: url.totalClicks,
//     clicksByDay: analyticsMap.get(url._id.toString()) || []
//   }));
// };

/**
 * Devuelve la analítica de una shortUrl concreta del usuario autenticado.
 */
const getShortUrlAnalytics = async (
  user: CustomJwtPayload,
  shortUrl: string
) => {
  // Busca la shortURL del usuario
  const urlDoc = await ShortURLModel.findOne({
    shortURL: shortUrl,
    user: user.id
  });
  if (!urlDoc) {
    throw new ValidationError('Short URL not found or not owned by user');
  }

  const metricsArr = await getOLDmetrics({ shortUrl: urlDoc._id });
  const metricsData = metricsArr[0] ?? {};

  return {
    shortURL: urlDoc.shortURL,
    url: urlDoc.url,
    title: urlDoc.title,
    logo: urlDoc.logo,
    description: urlDoc.description,
    createdAt: urlDoc.createdAt,
    totalClicks: urlDoc.totalClicks,
    metrics: {
      totalClicks: urlDoc.totalClicks,
      lastClickAt: metricsData.lastClickAt,
      topReferrer: metricsData.topReferrer,
      topDevice: metricsData.topDevice,
      topCountry: metricsData.topCountry
    }
  };
};

interface DailyClickResult {
  date: string;
  clicks: number;
  urls?: Array<{
    shortURL: string;
    url: string;
    clicks: number;
  }>;
}

interface PaginatedResult {
  data: DailyClickResult[];
  pagination: {
    totalDays: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface DailyClicksOptions {
  days?: number;
  order?: 'asc' | 'desc';
  includeUrls?: boolean;
  limit?: number;
  page?: number;
}

// SIMPLE METHOD TO GET DAILY CLICKS simple, good for graphs
// {clicks, date}
const getDailyClicks = async (
  user: CustomJwtPayload,
  options: DailyClicksOptions = {}
): Promise<PaginatedResult> => {
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
    page = 1
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
        totalDays: 0,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: 0
      }
    };
  }

  // Pipeline base - matchea las IDs de las URLs y la fecha de inicio si se proporciona
  const pipeline: PipelineStage[] = [
    {
      $match: {
        shortUrl: { $in: urlIds },
        ...(startDate && { timestamp: { $gte: startDate } })
      }
    }
  ];

  // Agregación común
  if (includeUrls) {
    pipeline.push(
      {
        $lookup: {
          from: 'shorturls',
          localField: 'shortUrl',
          foreignField: '_id',
          as: 'urlDetails'
        }
      },
      { $unwind: '$urlDetails' },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            shortURL: '$urlDetails.shortURL'
          },
          clicks: { $sum: 1 },
          originalUrl: { $first: '$urlDetails.url' }
        }
      },
      {
        $group: {
          _id: '$_id.day',
          date: { $first: '$_id.day' },
          totalClicks: { $sum: '$clicks' },
          urls: {
            $push: {
              shortURL: '$_id.shortURL',
              url: '$originalUrl',
              clicks: '$clicks'
            }
          }
        }
      }
    );
  } else {
    pipeline.push({
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        clicks: { $sum: 1 }
      }
    });
  }

  // Pipeline para contar el total de días (para paginación)
  const countPipeline = [
    ...pipeline,
    { $group: { _id: null, count: { $sum: 1 } } }
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
        ...(includeUrls && { urls: 1 })
      }
    },
    { $sort: { date: order === 'asc' ? 1 : -1 } },
    { $skip: (validatedPage - 1) * validatedLimit },
    { $limit: validatedLimit }
  );

  const data = await AnalyticsModel.aggregate<DailyClickResult>(pipeline);

  return {
    data,
    pagination: {
      totalDays,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(totalDays / validatedLimit)
    }
  };
};

const getShortUrlClicksByDay = async (
  user: CustomJwtPayload,
  shortUrl: string
) => {
  // Busca la shortURL del usuario
  const urlDoc = await ShortURLModel.findOne({
    shortURL: shortUrl,
    user: user.id
  });
  if (!urlDoc) return null;
  // Obtiene los clicks por día para esa shortUrl
  const clicksByDay = await getOLDmetrics({ shortUrl: urlDoc._id });
  return clicksByDay;
};

// get analytics with params
// Interfaces para tipado fuerte
// interface ClickByDay {
//   date: string;
//   clicks: number;
// }

// export const getAnalyticsAlways = async (
//   user: CustomJwtPayload,
//   page: number = 1,
//   limit: number = 50,
//   sortBy: 'totalClicks' | 'createdAt' | 'lastClickedAt' = 'createdAt',
//   order: 'asc' | 'desc' = 'desc'
// ) => {

//   const validSortFields = ['totalClicks', 'createdAt', 'lastClickedAt', 'shortCode'];
//   if (!validSortFields.includes(sortBy)) {
//     throw new ValidationError('Invalid sort field');
//   }

//   const baseQuery = ShortURLModel.find({ user: user.id })
//     .select('shortURL url title totalClicks lastClickAt createdAt')
//     .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
//     .lean();

//   // baseQuery.limit(Math.min(limit, 100));
//   baseQuery.skip((page - 1) * limit).limit(Math.min(limit, 100));
//   const urls = await baseQuery;
//   if (!urls.length) return [];

//   const urlIds = urls.map(u => u._id);
//   const dailyClicks = await AnalyticsModel.aggregate([
//     {
//       $match: {
//         shortUrl: { $in: urlIds },
//         timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 días
//       }
//     },
//     {
//       $group: {
//         _id: {
//           shortUrl: '$shortUrl',
//           day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
//         },
//         clicks: { $sum: 1 }
//       }
//     },
//     {
//       $group: {
//         _id: '$_id.shortUrl',
//         clicksByDay: {
//           $push: {
//             date: '$_id.day',
//             clicks: '$clicks'
//           }
//         }
//       }
//     }
//   ]);
//   const urlsWithDetails = await Promise.all(
//     urls.map(async url => {
//       const dailyClicks = await AnalyticsModel.aggregate<{ _id: string; clicksByDay: ClickByDay[] }>([
//         { $match: { shortUrl: url._id } },
//         {
//           $group: {
//             _id: {
//               day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
//             },
//             clicks: { $sum: 1 }
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             date: '$_id.day',
//             clicks: 1
//           }
//         },
//         { $sort: { date: -1 } }
//       ]);

//       return {
//         ...url,
//         dailyClicks
//       };
//     })
//   );

//   // Paso 3: Combinar eficientemente
//   type DailyClicksAgg = { _id: Types.ObjectId; clicksByDay: ClickByDay[] };
//   const dailyMap = new Map<string, ClickByDay[]>(
//     (dailyClicks as DailyClicksAgg[]).map(item => [item._id.toString(), item.clicksByDay])
//   );
//   return urls.map(url => ({
//     ...url,
//     clicksByDay: dailyMap.get(url._id.toString()) || [],
//   }));
// };

interface AnalyticsOptions {
  dailyClicks?: boolean;
  limit?: number;
  sortBy?: 'totalClicks' | 'createdAt' | 'lastClickedAt';
  order?: 'asc' | 'desc';
  page?: number;
}

interface DailyStat {
  date: string;
  clicks: number;
  referrers?: string[];
  devices?: string[];
}
interface UrlMetrics {
  _id?: Types.ObjectId;
  totalClicks?: number;
  lastClickAt?: Date;
  topReferrer?: string;
  topDevice?: string;
  topCountry?: string;
  dailyStats?: DailyStat[];
}

interface UrlWithMetrics {
  shortURL: string;
  url: string;
  title?: string;
  createdAt: Date;
  metrics: Omit<UrlMetrics, '_id'>;
}

interface AnalyticsPagination {
  totalUrls: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAnalytics = async (
  user: CustomJwtPayload,
  options: AnalyticsOptions = {}
): Promise<{ data: UrlWithMetrics[]; pagination: AnalyticsPagination }> => {
  if (!user?.id) {
    throw new ValidationError('No user authenticated');
  }

  const {
    dailyClicks = false,
    limit = 50,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1
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
    ShortURLModel.countDocuments({ user: user.id })
  ]);

  if (!urls.length)
    return {
      data: [],
      pagination: {
        totalUrls: 0,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: 0
      }
    };

  const urlIds = urls.map((u) => u._id);
  // obtener analytics por shortUrl
  const pipeline: PipelineStage[] = [
    { $match: { shortUrl: { $in: urlIds } } },
    {
      $group: {
        _id: '$shortUrl',
        lastClickAt: { $max: '$timestamp' },
        // TODO: we can add more fields here if needed
        topReferrer: { $first: '$referrer' },
        topDevice: { $first: '$deviceType' },
        topCountry: { $first: '$country' },
        // Solo agrupar por día si dailyClicks=true
        ...(dailyClicks && {
          dailyStats: {
            $push: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
              },
              clicks: 1, // Cada documento representa 1 click
              referrer: '$referrer',
              device: '$deviceType'
            }
          }
        })
      }
    }
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
                      $in: ['$$this.date', '$$value.date']
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
                              cond: { $eq: ['$$day.date', '$$this.date'] }
                            }
                          }
                        },
                        referrers: {
                          $map: {
                            input: {
                              $filter: {
                                input: '$dailyStats',
                                as: 'day',
                                cond: { $eq: ['$$day.date', '$$this.date'] }
                              }
                            },
                            as: 'day',
                            in: '$$day.referrer'
                          }
                        }
                      }
                    ]
                  ]
                }
              ]
            }
          }
        }
      }
    });
  }

  // 3. Ejecutar agregación
  const metricsData = await AnalyticsModel.aggregate<UrlMetrics>(pipeline);

  // 4. Mapear resultados
  const data = urls.map((url) => {
    // busca metricas, si no las encuentra, crea un objeto vacío
    const urlMetrics =
      metricsData.find((m) => m._id?.toString() === url._id.toString()) ?? {};

    // Construir respuesta
    const result: UrlWithMetrics = {
      shortURL: url.shortURL,
      url: url.url,
      title: url.title,
      createdAt: url.createdAt,
      metrics: {
        totalClicks: url.totalClicks,
        lastClickAt: urlMetrics.lastClickAt,
        topReferrer: urlMetrics.topReferrer,
        topDevice: urlMetrics.topDevice,
        topCountry: urlMetrics.topCountry,
        ...(options.dailyClicks && { dailyStats: urlMetrics.dailyStats })
      }
    };

    return result;
  });

  return {
    data,
    pagination: {
      totalUrls,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(totalUrls / validatedLimit)
    }
  };
};

interface TopMetric {
  name: string;
  count: number;
}

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
}

const getUserGlobalMetrics = async (
  user: CustomJwtPayload
): Promise<UserGlobalMetrics> => {
  // 1. Obtener los IDs de las URLs del usuario
  const urlIds = await ShortURLModel.distinct('_id', { user: user.id });

  // 2. Agregación global en Analytics
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
        topReferrers: { $push: '$referrer' }
      }
    }
  ]);

  // 3. Contar shorturls distintas
  const totalShortUrls = urlIds.length;

  // 4. Procesar top países, ciudades, browsers, deviceTypes, operatingSystems, referrers
  const countBy = (arr: string[] = []): TopMetric[] =>
    Object.entries(
      arr.filter(Boolean).reduce((acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

  // 5. Tendencias: clicks de la semana y media diaria del mes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 30);

  // Clicks de la semana (últimos 7 días)
  const [weekAgg] = await AnalyticsModel.aggregate<{ count: number }>([
    { $match: { shortUrl: { $in: urlIds }, timestamp: { $gte: weekAgo } } },
    { $count: 'count' }
  ]);
  const weekClicks = weekAgg?.count || 0;
  const weekAvgClicks = weekClicks / 7;

  // Clicks del mes (últimos 30 días)
  const [monthAgg] = await AnalyticsModel.aggregate<{ count: number }>([
    {
      $match: {
        shortUrl: { $in: urlIds },
        timestamp: { $gte: monthAgo, $lt: weekAgo }
      }
    },
    { $count: 'count' }
  ]);
  const monthClicks = monthAgg?.count || 0;
  const monthAvgClicks = monthClicks / 30;

  // Tendencia: comparación de la semana vs media diaria del mes anterior
  const trend =
    monthAvgClicks > 0
      ? ((weekAvgClicks - monthAvgClicks) / monthAvgClicks) * 100
      : null;

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
    trend
  };
};

export default {
  getShortUrlAnalytics,
  getDailyClicks,
  getShortUrlClicksByDay,
  getAnalytics,
  getUserGlobalMetrics
};
