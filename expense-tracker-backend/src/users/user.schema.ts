import mongoose, { Schema, Document } from 'mongoose';
import { hashPassword } from 'src/utils/hashPassword';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
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
