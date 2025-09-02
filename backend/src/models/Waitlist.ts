import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlist extends Document {
  email: string;
  source: 'foreverdocs' | 'general';
  referrer?: string;
  createdAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  source: {
    type: String,
    enum: ['foreverdocs', 'general'],
    default: 'general',
  },
  referrer: String,
}, {
  timestamps: true,
});

WaitlistSchema.index({ email: 1 });
WaitlistSchema.index({ createdAt: -1 });

export default mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);
