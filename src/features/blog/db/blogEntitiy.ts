import mongoose, { HydratedDocument, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export type BlogEntity = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogDocument = HydratedDocument<BlogEntity>;

export const blogSchema = new mongoose.Schema<BlogEntity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  isMembership: { type: Boolean, required: true, default: false },
});

export const BlogModelEntity = model<BlogEntity>('Blog', blogSchema);
