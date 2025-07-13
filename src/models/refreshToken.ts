import mongoose, { Schema } from 'mongoose';

const refreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
