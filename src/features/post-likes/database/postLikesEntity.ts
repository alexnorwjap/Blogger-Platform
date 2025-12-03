import mongoose, { HydratedDocument, model, Model, ObjectId } from 'mongoose';

type LikePost = {
  _id: ObjectId;
  userId: string;
  login: string;
  postId: string;
  status: string;
  createdAt: Date;
};

interface LikePostMethods {
  updateStatus(status: string): void;
}

interface LikePostStaticsMethods {
  createLike(userId: string, login: string, postId: string, status: string): LikePostDocument;
}

type LikePostDocument = HydratedDocument<LikePost, LikePostMethods>;
type LikePostModel = Model<LikePost, {}, LikePostMethods> & LikePostStaticsMethods;

const likePostSchema = new mongoose.Schema<LikePost, LikePostModel, LikePostMethods>({
  userId: { type: String, required: true },
  login: { type: String, required: true },
  postId: { type: String, required: true },
  status: { type: String, required: true, default: 'None' },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

class LikePostEntity {
  declare status: string;
  declare createdAt: Date;

  static createLike(
    userId: string,
    login: string,
    postId: string,
    status: string
  ): LikePostDocument {
    return new LikePostModel({ userId, login, postId, status });
  }

  updateStatus(status: string): void {
    this.status = status;
    this.createdAt = new Date();
  }
}

likePostSchema.loadClass(LikePostEntity);

const LikePostModel = model<LikePost, LikePostModel>('LikePost', likePostSchema);

export { LikePost, LikePostModel, LikePostDocument };
