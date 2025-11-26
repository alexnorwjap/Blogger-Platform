import mongoose, { HydratedDocument, model, ObjectId } from 'mongoose';

type CommentEntity = {
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

export type FilterSortPagination = {
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};

type CommentDocument = HydratedDocument<CommentEntity>;

const commentSchema = new mongoose.Schema<CommentEntity>({
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

const CommentModelEntity = model<CommentEntity>('Comment', commentSchema);

export { CommentEntity, commentSchema, CommentModelEntity, CommentDocument };
