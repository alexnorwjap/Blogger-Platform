import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InputBlogDto } from '../service/blogServiceDto';

type Blog = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

interface BlogMethods {
  updateBlog(dto: InputBlogDto): void;
}
interface BlogStaticsMethods {
  createBlog(dto: InputBlogDto): BlogDocument;
}

type BlogDocument = HydratedDocument<Blog, BlogMethods>;
type BlogModel = Model<Blog, {}, BlogMethods> & BlogStaticsMethods;

const blogSchema = new mongoose.Schema<Blog>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  isMembership: { type: Boolean, required: true, default: false },
});

class BlogEntity {
  declare name: string;
  declare description: string;
  declare websiteUrl: string;

  static createBlog(dto: InputBlogDto): BlogDocument {
    return new BlogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
  }

  updateBlog(dto: InputBlogDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

blogSchema.loadClass(BlogEntity);

const BlogModel = model<Blog, BlogModel>('Blog', blogSchema);

export { BlogDocument, Blog, BlogModel };
