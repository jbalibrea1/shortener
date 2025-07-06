import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import AnalyticsModel from '../models/analytics.model';
import ShortURLModel from '../models/shortURL.model';
import UserModel from '../models/user.model';
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
    }
  ]);

  // Crea analytics simulando clics en diferentes días
  type AnalyticsSeed = {
    shortUrl: Types.ObjectId;
    timestamp: Date;
    ipAddress: string;
    userId: Types.ObjectId;
  };
  const analytics: AnalyticsSeed[] = [];
  // start 30 días atrás
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = new Date();
  for (const url of urls) {
    let totalClicks = 0;
    for (
      let d = new Date(start.getTime());
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      // Simula entre 1 y 5 clics por día
      const clicks = Math.floor(Math.random() * 5) + 1;
      totalClicks += clicks;
      for (let i = 0; i < clicks; i++) {
        analytics.push({
          shortUrl: url._id,
          timestamp: new Date(d),
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${i + 1}`,
          userId: user._id
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
