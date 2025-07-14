import logger from '@/logger';

/**
 * Extrae deviceType, browser y operatingSystem a partir del user-agent
 */
export function parseUserAgent(userAgent: string) {
  let deviceType = 'desktop';
  if (/mobile/i.test(userAgent)) deviceType = 'mobile';
  if (/tablet/i.test(userAgent)) deviceType = 'tablet';

  let browser = 'unknown';
  if (/chrome|crios/i.test(userAgent)) browser = 'chrome';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'firefox';
  else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent))
    browser = 'safari';
  else if (/edg/i.test(userAgent)) browser = 'edge';
  else if (/opera|opr/i.test(userAgent)) browser = 'opera';
  else if (/msie|trident/i.test(userAgent)) browser = 'ie';
  else if (/brave/i.test(userAgent)) browser = 'brave';
  else if (/vivaldi/i.test(userAgent)) browser = 'vivaldi';
  else if (/duckduckgo/i.test(userAgent)) browser = 'duckduckgo';

  let operatingSystem = 'unknown';
  if (/windows/i.test(userAgent)) operatingSystem = 'windows';
  else if (/macintosh|mac os x|mac/i.test(userAgent)) operatingSystem = 'macOS';
  else if (/linux/i.test(userAgent)) operatingSystem = 'linux';
  else if (/android/i.test(userAgent)) operatingSystem = 'android';
  else if (/iphone|ipad|ipod/i.test(userAgent)) operatingSystem = 'iOS';
  else if (/blackberry/i.test(userAgent)) operatingSystem = 'blackberry';
  else if (/webos/i.test(userAgent)) operatingSystem = 'webOS';

  return { deviceType, browser, operatingSystem };
}

/**
 * Obtiene país y ciudad a partir de una IP usando ip-api.com
 */
interface IpApiResponse {
  country?: string;
  city?: string;
  [key: string]: unknown;
}
export async function getGeoFromIp(
  ip: string
): Promise<{ country: string; city: string }> {
  let country = 'unknown';
  let city = 'unknown';
  try {
    const ipData = await fetch(`http://ip-api.com/json/${ip}`);
    const data = (await ipData.json()) as IpApiResponse;
    country = data.country || 'unknown';
    city = data.city || 'unknown';
  } catch (error) {
    // Puedes loggear aquí si quieres
    logger.error(`Error al obtener geolocalización de IP ${ip}:`, error);
  }
  return { country, city };
}
