import mongoose, { HydratedDocument, Model, model, ObjectId } from 'mongoose';
import { UserDocument } from '../../auth/database/userEntity';

type Comment = {
  _id: ObjectId;
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: String;
  };
};

interface CommentMethods {
  updateComment(content: string): void;
  updateLike(likesInfo: { likesCount: number; dislikesCount: number }): void;
}

interface CommentStaticsMethods {
  createComment(postId: string, content: string, user: UserDocument): CommentDocument;
}

type CommentDocument = HydratedDocument<Comment, CommentMethods>;
type CommentModel = Model<Comment, {}, CommentMethods> & CommentStaticsMethods;

const commentSchema = new mongoose.Schema<Comment, CommentModel, CommentMethods>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: Date, required: true, default: () => new Date() },
  likesInfo: {
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
    myStatus: { type: String, required: true, default: 'None' },
  },
});

class CommentEntity {
  declare content: string;
  declare likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  static createComment(postId: string, content: string, user: UserDocument): CommentDocument {
    return new CommentModel({
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
    });
  }

  updateComment(content: string): void {
    this.content = content;
  }

  updateLike(status: { likesCount: number; dislikesCount: number }): void {
    this.likesInfo.likesCount = status.likesCount;
    this.likesInfo.dislikesCount = status.dislikesCount;
  }
}

commentSchema.loadClass(CommentEntity);

const CommentModel = model<Comment, CommentModel>('Comment', commentSchema);

export { Comment, CommentModel, CommentDocument };
