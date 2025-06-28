import mongoose, { Schema, Types } from 'mongoose';

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  _id: Types.ObjectId;
}

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
