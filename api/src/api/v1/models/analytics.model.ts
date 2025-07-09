import mongoose from 'mongoose';

// TODO: add more fields to track like desktop/mobile, from which browser, country, etc.
const analyticsSchema = new mongoose.Schema({
  shortUrl: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortURL',
    required: true
  },
  referrer: String,
  deviceType: String,
  country: String,
  timestamp: { type: Date, default: Date.now },
});
analyticsSchema.index({ shortUrl: 1, timestamp: 1 });
analyticsSchema.index({ timestamp: 1 });
export const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);
