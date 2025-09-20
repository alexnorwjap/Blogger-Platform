import { Blog } from './blogs.types';
import { BlogBodyOutput } from './blogs.dto';
import { WithId } from 'mongodb';

export const toBlogDTO = (object: WithId<Blog>): BlogBodyOutput => {
  return {
    id: object._id.toString(),
    name: object.name,
    description: object.description,
    websiteUrl: object.websiteUrl,
    createdAt: object.createdAt,
    isMembership: object.isMembership,
  };
};
