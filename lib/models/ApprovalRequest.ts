import mongoose from 'mongoose';

const ApprovalRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['fundraiser', 'wallet_topup'],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // For fundraiser requests
  fundraiserId: {
    type: String,
    required: function(this: { type?: string }) { return this.type === 'fundraiser'; },
  },
  // For wallet top-up requests
  amount: {
    type: Number,
    required: function(this: { type?: string }) { return this.type === 'wallet_topup'; },
    min: 1,
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: String, // Admin ID
  },
  rejectedAt: {
    type: Date,
  },
  rejectedBy: {
    type: String, // Admin ID
  },
  rejectionReason: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

export default mongoose.models.ApprovalRequest || mongoose.model('ApprovalRequest', ApprovalRequestSchema);
