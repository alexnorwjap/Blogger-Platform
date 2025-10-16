import { userCollection } from '../../../db/mongo.db';
import { AuthRepository } from '../repository/authRepo';
import { AuthMapper } from './authMapper';
import { authModel } from '../model/authModel';
import { inputCreateDto } from './entity';
import { ObjectId } from 'mongodb';
import { InputConfirmationDto } from '../repository/dto/authDto';

export class AuthRepoImpl implements AuthRepository {
  async create(dto: inputCreateDto): Promise<authModel> {
    const user = await userCollection.insertOne({ _id: new ObjectId(), ...dto });
    return AuthMapper.toService({ _id: user.insertedId, ...dto });
  }
  async update(userId: string, dto: InputConfirmationDto): Promise<boolean> {
    const result = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { ...dto } });
    if (result.modifiedCount > 0) {
      return true;
    }
    return false;
  }
  async delete(userId: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }
}
