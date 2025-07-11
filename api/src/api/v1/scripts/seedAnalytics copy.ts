/* eslint-disable no-console */
import { AnalyticsModel, ShortURLModel, UserModel } from '@/api/v1/models';
import 'dotenv/config';
import mongoose, { Types } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  await mongoose.connect(MONGODB_URI);

  // Cambia el username por el de tu usuario real
  const user = await UserModel.findOne({ username: 'jorge' });
  if (!user) throw new Error('Usuario no encontrado');
  await ShortURLModel.deleteMany({ user: user._id });
  await AnalyticsModel.deleteMany({ userId: user._id });
  // Crea varias URLs
  const urls = await ShortURLModel.insertMany([
    {
      url: 'https://jbalibrea.dev',
      shortURL: 'jbalibrea',
      user: user._id,
      title: 'Jorge Balibrea',
      createdAt: new Date('2025-06-01')
    },
    {
      url: 'https://openai.com',
      shortURL: 'openai',
      user: user._id,
      title: 'OpenAI',
      createdAt: new Date('2025-06-06')
    },
    {
      url: 'https://github.com',
      shortURL: 'github',
      user: user._id,
      title: 'GitHub',
      createdAt: new Date('2025-06-10')
    },
    {
      url: 'https://wikipedia.org',
      shortURL: 'wiki',
      user: user._id,
      title: 'Wikipedia',
      createdAt: new Date('2025-06-15')
    },
    {
      url: 'https://youtube.com',
      shortURL: 'youtube',
      user: user._id,
      title: 'YouTube',
      createdAt: new Date('2025-06-20')
    },
    {
      url: 'https://x.com',
      shortURL: 'twitter',
      user: user._id,
      title: 'X',
      createdAt: new Date('2025-06-25')
    },
    {
      url: 'https://facebook.com',
      shortURL: 'facebook',
      user: user._id,
      title: 'Facebook',
      createdAt: new Date('2025-07-01')
    },
    {
      url: 'https://amazon.com',
      shortURL: 'amazon',
      user: user._id,
      title: 'Amazon',
      createdAt: new Date('2025-07-05')
    },
    {
      url: 'https://stackoverflow.com',
      shortURL: 'stackoverflow',
      user: user._id,
      title: 'Stack Overflow',
      createdAt: new Date('2025-07-08')
    }
  ]);

  // Crea analytics simulando clics en diferentes días y con variedad de datos
  type AnalyticsSeed = {
    shortUrl: Types.ObjectId;
    timestamp: Date;
    ipAddress: string;
    userId: Types.ObjectId;
    browser: string;
    deviceType: string;
    country: string;
    referrer: string;
  };
  const browsers = [
    'Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Opera',
    'Brave',
    'IE',
    'Samsung Internet'
  ];
  const deviceTypes = ['desktop', 'mobile', 'tablet', 'bot'];
  const countries = [
    'Spain',
    'United States',
    'France',
    'Germany',
    'Italy',
    'United Kingdom',
    'Mexico',
    'Argentina',
    'Brazil',
    'India',
    'China',
    'Japan',
    'Russia',
    'Canada',
    'Australia'
  ];
  const referrers = [
    'https://google.com',
    'https://twitter.com',
    'https://facebook.com',
    'https://linkedin.com',
    'https://reddit.com',
    'https://t.co',
    'https://wa.me',
    '',
    '',
    ''
  ];
  const analytics: AnalyticsSeed[] = [];
  // start 90 días atrás para más variedad
  const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const end = new Date();
  for (const url of urls) {
    let totalClicks = 0;
    for (
      let d = new Date(start.getTime());
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      // Simula entre 3 y 20 clics por día
      const clicks = Math.floor(Math.random() * 18) + 3;
      totalClicks += clicks;
      for (let i = 0; i < clicks; i++) {
        analytics.push({
          shortUrl: url._id,
          timestamp: new Date(
            d.getTime() + Math.floor(Math.random() * 86400000)
          ), // hora aleatoria del día
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
            Math.random() * 255
          )}`,
          userId: user._id,
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          deviceType:
            deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)]
        });
      }
    }
    // Actualiza el totalClicks de la URL
    await ShortURLModel.updateOne({ _id: url._id }, { $set: { totalClicks } });
  }
  await AnalyticsModel.insertMany(analytics);

  console.log('Seed completado');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
