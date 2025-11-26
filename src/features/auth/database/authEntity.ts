import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, model } from 'mongoose';

export type entityDB = {
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
  recoveryCode?: string;
  recoveryCodeExpirationDate?: Date;
};

export type inputCreateDto = {
  email: string;
  login: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
};

export type AuthDocument = HydratedDocument<entityDB>;

export const authSchema = new mongoose.Schema<entityDB>({
  email: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  isConfirmed: { type: Boolean, required: true, default: false },
  confirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  recoveryCode: { type: String, required: false },
  recoveryCodeExpirationDate: { type: Date, required: false },
});

export const AuthModelEntity = model<entityDB>('User', authSchema);
