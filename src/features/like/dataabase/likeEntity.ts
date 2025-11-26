import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, model } from 'mongoose';

type LikeEntityDb = {
  _id: ObjectId;
  userId: string;
  commentId: string;
  postId: string;
  status: string;
  createdAt: Date;
};

type LikeDocument = HydratedDocument<LikeEntityDb>;

const likeSchema = new mongoose.Schema<LikeEntityDb>({
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  postId: { type: String, required: true },
  status: { type: String, required: true, default: 'None' },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

const LikeModelEntity = model<LikeEntityDb>('Like', likeSchema);

export { LikeEntityDb, likeSchema, LikeModelEntity, LikeDocument };
