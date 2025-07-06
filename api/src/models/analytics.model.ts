import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  shortUrl: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortURL',
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);

export default AnalyticsModel;
