import { CommandCommentsRepository } from '../repository/commandRepo';
import { commentCollection } from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { CommentModel } from '../model/commentModel';
import { CommentQueryMapper } from './queryMapper';
import { CommentEntity } from './entity';

export class CommentsCommandRepoImpl implements CommandCommentsRepository {
  async updateComment(id: string, content: string): Promise<boolean> {
    const result = await commentCollection.updateOne({ _id: new ObjectId(id) }, { $set: { content } });
    return result.modifiedCount > 0;
  }
  async deleteComment(id: string): Promise<boolean> {
    const result = await commentCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
  async createCommentByPostId(CommentEntity: CommentEntity): Promise<string> {
    const result = await commentCollection.insertOne({
      _id: new ObjectId(),
      ...CommentEntity,
    });
    return result.insertedId.toString();
  }
}
