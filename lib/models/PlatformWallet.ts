import mongoose from 'mongoose';

const PlatformWalletSchema = new mongoose.Schema({
  totalTips: {
    type: Number,
    default: 0,
  },
  totalDonations: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// This will be a singleton collection with only one document
export default mongoose.models.PlatformWallet || mongoose.model('PlatformWallet', PlatformWalletSchema);