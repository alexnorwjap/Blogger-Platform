import { Blog } from './blogs.types';
import { BlogBodyOutput } from './blogs.dto';
import { WithId } from 'mongodb';

export const toBlogDTO = (object: WithId<Blog>): BlogBodyOutput => {
  return {
    ...object,
    id: object._id.toString(),
  };
};
