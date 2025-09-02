import mongoose, { Schema, Document } from 'mongoose';

export interface IMetric extends Document {
  platform: 'tiktok' | 'spotify' | 'youtube' | 'discord' | 'web' | 'instagram' | 'threads';
  key: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const MetricSchema = new Schema<IMetric>({
  platform: {
    type: String,
    enum: ['tiktok', 'spotify', 'youtube', 'discord', 'web', 'instagram', 'threads'],
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

MetricSchema.index({ platform: 1, key: 1, timestamp: -1 });
MetricSchema.index({ timestamp: -1 });

export default mongoose.model<IMetric>('Metric', MetricSchema);
