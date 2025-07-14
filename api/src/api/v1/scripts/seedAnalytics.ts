/** biome-ignore-all lint/suspicious/noConsole: <its okay> */
import { AnalyticsModel, ShortURLModel, UserModel } from '@/api/v1/models';
import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Configuración del seed
const SEED_CONFIG = {
  DAYS_TO_SEED: 90,
  MAX_CLICKS_PER_DAY: 50,
  USERNAME: 'jorge',
  URLS: [
    {
      url: 'https://jbalibrea.dev',
      shortCode: 'jbalibrea',
      title: 'Jorge Balibrea',
    },
    {
      url: 'https://openai.com',
      shortCode: 'openai',
      title: 'OpenAI',
    },
    {
      url: 'https://github.com',
      shortCode: 'github',
      title: 'GitHub',
    },
    {
      url: 'https://wikipedia.org',
      shortCode: 'wiki',
      title: 'Wikipedia',
    },
    {
      url: 'https://youtube.com',
      shortCode: 'youtube',
      title: 'YouTube',
    },
    {
      url: 'https://x.com',
      shortCode: 'twitter',
      title: 'X',
    },
    {
      url: 'https://facebook.com',
      shortCode: 'facebook',
      title: 'Facebook',
    },
    {
      url: 'https://amazon.com',
      shortCode: 'amazon',
      title: 'Amazon',
    },
    {
      url: 'https://stackoverflow.com',
      shortCode: 'stackoverflow',
      title: 'Stack Overflow',
    },
  ],
};

// Datos para generación realista
const BROWSERS = [
  { name: 'Chrome', weight: 0.65 },
  { name: 'Safari', weight: 0.2 },
  { name: 'Firefox', weight: 0.05 },
  { name: 'Edge', weight: 0.05 },
  { name: 'Other', weight: 0.05 },
];

const DEVICES = [
  { type: 'mobile', weight: 0.6 },
  { type: 'desktop', weight: 0.35 },
  { type: 'tablet', weight: 0.05 },
];

// CITIES: mayoría de España, pero añade algunas internacionales
const CITIES = [
  { name: 'Madrid', country: 'Spain', weight: 0.18 },
  { name: 'Barcelona', country: 'Spain', weight: 0.12 },
  { name: 'Valencia', country: 'Spain', weight: 0.1 },
  { name: 'Seville', country: 'Spain', weight: 0.08 },
  { name: 'Zaragoza', country: 'Spain', weight: 0.07 },
  { name: 'Málaga', country: 'Spain', weight: 0.07 },
  { name: 'Murcia', country: 'Spain', weight: 0.15 },
  { name: 'Palma', country: 'Spain', weight: 0.04 },
  { name: 'Las Palmas', country: 'Spain', weight: 0.04 },
  { name: 'Bilbao', country: 'Spain', weight: 0.04 },
  { name: 'Paris', country: 'France', weight: 0.04 },
  { name: 'Berlin', country: 'Germany', weight: 0.04 },
  { name: 'London', country: 'United Kingdom', weight: 0.04 },
  { name: 'New York', country: 'United States', weight: 0.03 },
  { name: 'Mexico City', country: 'Mexico', weight: 0.03 },
  { name: 'Buenos Aires', country: 'Argentina', weight: 0.02 },
  { name: 'Tokyo', country: 'Japan', weight: 0.02 },
];

const REFERRERS = [
  { url: 'direct', weight: 0.3 },
  { url: 'https://google.com', weight: 0.25 },
  { url: 'https://twitter.com', weight: 0.15 },
  { url: 'https://facebook.com', weight: 0.1 },
  { url: 'https://linkedin.com', weight: 0.05 },
  { url: 'https://reddit.com', weight: 0.05 },
  { url: 'https://t.co', weight: 0.05 },
  { url: 'other', weight: 0.05 },
];

// Nuevos datos para operatingSystem y userAgent
const OPERATING_SYSTEMS = [
  { name: 'Windows', weight: 0.4 },
  { name: 'macOS', weight: 0.2 },
  { name: 'Linux', weight: 0.15 },
  { name: 'Android', weight: 0.15 },
  { name: 'iOS', weight: 0.1 },
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-A528B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
];

// Función para selección ponderada
function weightedRandom<T extends { weight: number }>(options: T[]): T {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    if (random < option.weight) {
      return option;
    }
    random -= option.weight;
  }

  return options[0];
}

// Función para distribución gaussiana
function gaussianRandom(mean: number, std: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.min(
    23,
    Math.max(
      0,
      Math.floor(
        mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      )
    )
  );
}

function getRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getRealisticTimestamp(baseDate: Date): Date {
  const date = new Date(baseDate);
  const hour = gaussianRandom(13, 4); // Pico a las 13:00
  date.setHours(hour);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

function getClicksForDay(urlIndex: number, daysSinceCreation: number): number {
  // Crecimiento orgánico: más clics para URLs más nuevas al principio
  const growthFactor = 1 + urlIndex * 0.1;

  // Variación semanal (menos clics los fines de semana)
  const dayOfWeek = daysSinceCreation % 7;
  const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;

  // Variación aleatoria con distribución de Poisson
  const lambda = 10 * growthFactor * weekendFactor;
  const L = Math.exp(-lambda);
  let p = 1.0;
  let k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return Math.min(SEED_CONFIG.MAX_CLICKS_PER_DAY, k - 1);
}

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);

  // Obtener usuario
  console.log(`Buscando usuario ${SEED_CONFIG.USERNAME}...`);
  const user = await UserModel.findOne({ username: SEED_CONFIG.USERNAME });
  if (!user) throw new Error('Usuario no encontrado');

  // Limpiar datos existentes
  console.log('Limpiando datos existentes...');
  await ShortURLModel.deleteMany({ user: user._id });
  await AnalyticsModel.deleteMany({ userId: user._id });

  // Crear URLs
  console.log('Creando URLs...');
  const creationDates = Array.from(
    { length: SEED_CONFIG.URLS.length },
    (_, i) => {
      const daysAgo = SEED_CONFIG.DAYS_TO_SEED - i * 3; // URLs más nuevas más recientes
      return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    }
  );

  const urls = await ShortURLModel.insertMany(
    SEED_CONFIG.URLS.map((url, index) => ({
      ...url,
      user: user._id,
      createdAt: creationDates[index],
      updatedAt: creationDates[index],
    }))
  );

  // Generar analytics
  console.log('Generando datos de analytics...');
  const endDate = new Date();
  const analyticsBatch: unknown[] = [];
  let totalClicksGenerated = 0;

  for (const [index, url] of urls.entries()) {
    const urlCreationDate = url.createdAt;
    const currentDate = new Date(urlCreationDate);
    let urlTotalClicks = 0;

    while (currentDate <= endDate) {
      const daysSinceCreation = Math.floor(
        (currentDate.getTime() - urlCreationDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const clicks = getClicksForDay(index, daysSinceCreation);
      urlTotalClicks += clicks;

      for (let i = 0; i < clicks; i++) {
        const browser = weightedRandom(BROWSERS).name;
        const device = weightedRandom(DEVICES).type;
        const cityObj = weightedRandom(CITIES);
        const country = cityObj.country;
        const referrer = weightedRandom(REFERRERS).url;
        const operatingSystem = weightedRandom(OPERATING_SYSTEMS).name;
        const userAgent =
          USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        analyticsBatch.push({
          shortUrl: url._id,
          timestamp: getRealisticTimestamp(currentDate),
          ipAddress: getRandomIP(),
          userId: user._id,
          browser,
          deviceType: device,
          country,
          referrer: referrer === 'direct' ? '' : referrer,
          city: cityObj.name,
          operatingSystem,
          userAgent,
        });

        totalClicksGenerated++;

        // Insertar por lotes para mejor rendimiento
        if (analyticsBatch.length >= 1000) {
          await AnalyticsModel.insertMany(analyticsBatch);
          analyticsBatch.length = 0;
          console.log(`Generados ${totalClicksGenerated} clics...`);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await ShortURLModel.updateOne(
      { _id: url._id },
      { $set: { totalClicks: urlTotalClicks } }
    );
  }

  // Insertar los últimos registros si los hay
  if (analyticsBatch.length > 0) {
    await AnalyticsModel.insertMany(analyticsBatch);
  }

  console.log('Seed completado con éxito');
  console.log(`- URLs creadas: ${urls.length}`);
  console.log(`- Clics generados: ${totalClicksGenerated}`);
  console.log(`- Período cubierto: ${SEED_CONFIG.DAYS_TO_SEED} días`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
