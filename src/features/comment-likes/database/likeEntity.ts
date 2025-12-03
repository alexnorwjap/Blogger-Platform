import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { ObjectId } from 'mongodb';

type LikeComment = {
  _id: ObjectId;
  userId: string;
  commentId: string;
  status: string;
  createdAt: Date;
};

interface LikeCommentMethods {
  updateStatus(status: string): void;
}

interface LikeCommentStaticsMethods {
  createLike(userId: string, commentId: string, status: string): LikeCommentDocument;
}
type LikeCommentDocument = HydratedDocument<LikeComment, LikeCommentMethods>;
type LikeCommentModel = Model<LikeComment, {}, LikeCommentMethods> & LikeCommentStaticsMethods;

const likeSchema = new mongoose.Schema<LikeComment, LikeCommentModel, LikeCommentMethods>({
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  status: { type: String, required: true, default: 'None' },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

class LikeCommentEntity {
  declare status: string;

  static createLike(userId: string, commentId: string, status: string): LikeCommentDocument {
    return new LikeCommentModel({ userId, commentId, status });
  }

  updateStatus(status: string): void {
    this.status = status;
  }
}

likeSchema.loadClass(LikeCommentEntity);

const LikeCommentModel = model<LikeComment, LikeCommentModel>('Like', likeSchema);

export { LikeComment, LikeCommentModel, LikeCommentDocument };
