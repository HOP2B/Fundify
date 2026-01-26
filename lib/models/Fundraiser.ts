import mongoose from 'mongoose';

const FundraiserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 2000,
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'memorial', 'emergency', 'nonprofit', 'education', 'animals', 'environment', 'business', 'community', 'creative', 'event', 'faith', 'family', 'sports', 'travel', 'volunteer', 'wishes', 'competition', 'other'],
  },
  image: {
    type: String, // URL or base64
    required: false,
  },
  forWhom: {
    type: String,
    required: true,
    enum: ['myself', 'someone_else'],
  },
  creator: {
    type: String, // Clerk user ID
    required: true,
  },
  raised: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Fundraiser || mongoose.model('Fundraiser', FundraiserSchema);