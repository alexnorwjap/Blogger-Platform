import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, Model, model } from 'mongoose';

type PostEntity = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type InputForUpdatePost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

type PostDocument = HydratedDocument<PostEntity>;
// type PostModel = Model<PostEntity>; //зачем?

const postSchema = new mongoose.Schema<PostEntity>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

const PostModelEntity = model<PostEntity>('Post', postSchema);

export { InputForUpdatePost, PostEntity, postSchema, PostModelEntity, PostDocument };
