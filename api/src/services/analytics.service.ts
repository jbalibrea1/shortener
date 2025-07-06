import { CustomJwtPayload } from '@/interfaces';
import AnalyticsModel from '@/models/analytics.model';
import ShortURLModel from '@/models/shortURL.model';

interface ClickByDay {
  date: string;
  clicks: number;
}

interface AnalyticsAgg {
  _id: string;
  clicksByDay: ClickByDay[];
}

// Utilidad para obtener clicks por día dado un filtro de shortUrl(s)
type ShortUrlFilter = Record<string, unknown>;
const getClicksByDay = async (shortUrlFilter: ShortUrlFilter) => {
  return AnalyticsModel.aggregate<AnalyticsAgg>([
    { $match: shortUrlFilter },
    {
      $group: {
        _id: {
          shortUrl: '$shortUrl',
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        clicks: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.shortUrl',
        clicksByDay: {
          $push: {
            date: '$_id.day',
            clicks: '$clicks'
          }
        }
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
const getUserAnalytics = async (user: CustomJwtPayload) => {
  const urls = await ShortURLModel.find({ user: user.id })
    .select(
      'shortURL url title logo description createdAt updatedAt totalClicks'
    )
    .sort({ createdAt: -1 });

  const urlIds = urls.map((url) => url._id);
  const analyticsByUrl = await getClicksByDay({ shortUrl: { $in: urlIds } });
  const analyticsMap = new Map<string, ClickByDay[]>(
    analyticsByUrl.map((a) => [a._id.toString(), a.clicksByDay])
  );

  return urls.map((url) => ({
    shortURL: url.shortURL,
    url: url.url,
    title: url.title,
    logo: url.logo,
    description: url.description,
    createdAt: url.createdAt,
    totalClicks: url.totalClicks,
    clicksByDay: analyticsMap.get(url._id.toString()) || []
  }));
};

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
  if (!urlDoc) return null;

  // Obtiene clicks por día para esa shortUrl
  const analyticsByUrl = await getClicksByDay({ shortUrl: urlDoc._id });
  const clicksByDay = analyticsByUrl[0]?.clicksByDay || [];

  return {
    shortURL: urlDoc.shortURL,
    url: urlDoc.url,
    title: urlDoc.title,
    logo: urlDoc.logo,
    description: urlDoc.description,
    createdAt: urlDoc.createdAt,
    totalClicks: urlDoc.totalClicks,
    clicksByDay
  };
};

/**
 * Devuelve los clics por día sumados de todas las URLs del usuario.
 */
const getUserClicksByDay = async (user: CustomJwtPayload) => {
  const urls = await ShortURLModel.find({ user: user.id }).select('_id');
  const urlIds = urls.map((url) => url._id);

  const clicksByDay = await AnalyticsModel.aggregate<{
    date: string;
    clicks: number;
  }>([
    { $match: { shortUrl: { $in: urlIds } } },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        clicks: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: '$_id.day',
        clicks: 1
      }
    },
    { $sort: { date: -1 } }
  ]);

  return clicksByDay;
};

export default { getUserAnalytics, getShortUrlAnalytics, getUserClicksByDay };
