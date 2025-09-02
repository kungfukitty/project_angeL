import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMembership extends Document {
  userId: Types.ObjectId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  tier: 'vip';
  status: 'active' | 'canceled' | 'incomplete' | 'past_due';
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stripeCustomerId: String,
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  tier: {
    type: String,
    enum: ['vip'],
    default: 'vip',
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'incomplete', 'past_due'],
    default: 'incomplete',
  },
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

MembershipSchema.index({ userId: 1 });
MembershipSchema.index({ stripeCustomerId: 1 });
MembershipSchema.index({ stripeSubscriptionId: 1 });

export default mongoose.model<IMembership>('Membership', MembershipSchema);
