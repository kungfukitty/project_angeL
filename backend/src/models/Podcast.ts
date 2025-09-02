import mongoose, { Schema, Document } from 'mongoose';

export interface IPodcast extends Document {
  externalId: string;
  platform: 'spotify' | 'youtube';
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  publishedAt: Date;
}

const PodcastSchema = new Schema<IPodcast>({
  externalId: { type: String, required: true },
  platform: { type: String, enum: ['spotify', 'youtube'], required: true },
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  thumbnailUrl: String,
  duration: Number,
  publishedAt: { type: Date, required: true },
}, {
  timestamps: true,
});

PodcastSchema.index({ externalId: 1, platform: 1 }, { unique: true });
PodcastSchema.index({ publishedAt: -1 });

export default mongoose.model<IPodcast>('Podcast', PodcastSchema);
