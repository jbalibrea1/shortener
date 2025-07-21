import mongoose from 'mongoose';

// TODO: cambiar shortURL por shortUrl, o incluso shortCode
const shortURLSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    shortCode: { type: String, unique: true, required: true },
    totalClicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Transform the returned object to a more readable format
shortURLSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

shortURLSchema.index({ user: 1 });

shortURLSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await mongoose.model('Analytics').deleteMany({ shortUrl: doc._id });
  }
});

export const ShortURLModel = mongoose.model('ShortURL', shortURLSchema);
