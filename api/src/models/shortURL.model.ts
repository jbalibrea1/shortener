/* eslint-disable */
import mongoose from 'mongoose';

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
    shortURL: { type: String, unique: true, required: true },
    totalClicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Transform the returned object to a more readable format
shortURLSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const ShortURLModel = mongoose.model('ShortURL', shortURLSchema);

export default ShortURLModel;
