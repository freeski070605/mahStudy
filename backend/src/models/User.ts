import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const record = ret as unknown as Record<string, unknown>;
    record.id = record._id;
    delete record._id;
    delete record.passwordHash;
    delete record.__v;
    return ret;
  },
});

export default mongoose.model<IUser>('User', userSchema);
