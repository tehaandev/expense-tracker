import mongoose, { Schema, Document } from 'mongoose';
import { hashPassword } from 'src/utils/hashPassword';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  monthlyExpenseLimit?: number;
  currency: string;
  limitEnabled: boolean;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    monthlyExpenseLimit: {
      type: Number,
      min: [0, 'Monthly expense limit must be positive'],
      default: null,
    },
    currency: {
      type: String,
      enum: ['USD', 'LKR', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'],
      default: 'USD',
    },
    limitEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving if it's modified
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await hashPassword(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

export const User = mongoose.model<UserDocument>('User', UserSchema);
export { UserSchema };
