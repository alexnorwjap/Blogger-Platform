import { Blog } from './blogs.types';
import { BlogBodyOutput } from './blogs.dto';

export const toBlogDTO = (object: Blog): BlogBodyOutput => {
  return {
    ...object,
    id: String(object.id),
  };
};
