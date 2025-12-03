import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { InputPostDto } from '../../service/serviceDto';
import { UpdatePostDto } from '../../repositories/dto/postRepoDto';

type NewestLikes = {
  userId: string;
  login: string;
  addedAt: Date;
};

type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
};

type Post = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfo;
};
interface PostMethods {
  updatePost(dto: UpdatePostDto): void;
  updateExtendedLikesInfo(countStatus: { likesCount: number; dislikesCount: number }): void;
}

interface PostStaticsMethods {
  createPost(dto: InputPostDto, blogName: string): PostDocument;
}

type PostDocument = HydratedDocument<Post, PostMethods>;
type PostModel = Model<Post, {}, PostMethods> & PostStaticsMethods;

const postSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  extendedLikesInfo: {
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
    myStatus: { type: String, required: true, default: 'None' },
    newestLikes: {
      type: Array,
      required: true,
      default: [],
    },
  },
});

class PostEntity {
  declare title: string;
  declare shortDescription: string;
  declare content: string;
  declare blogId: string;
  declare extendedLikesInfo: ExtendedLikesInfo;

  static createPost(dto: InputPostDto, blogName: string): PostDocument {
    return new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogName,
    });
  }

  updatePost(dto: UpdatePostDto): void {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }

  updateExtendedLikesInfo(countStatus: { likesCount: number; dislikesCount: number }): void {
    this.extendedLikesInfo.likesCount = countStatus.likesCount;
    this.extendedLikesInfo.dislikesCount = countStatus.dislikesCount;
  }
}

postSchema.loadClass(PostEntity);

const PostModel = model<Post, PostModel>('Post', postSchema);

export { Post, PostModel, PostDocument, NewestLikes };
