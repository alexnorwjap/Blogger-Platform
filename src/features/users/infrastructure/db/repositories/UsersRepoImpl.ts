import { UsersRepository } from '../../../repositories/usersRepository';
import { InputUserDto } from '../../../repositories/dto/commandsUserDto';
import { UserViewModel } from '../../../models/User';
import { userCollection } from '../../../../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { Result } from '../../../../../shared/utils/result-object';

export class UsersRepoImpl implements UsersRepository {
  async create(dto: InputUserDto): Promise<string | null> {
    const result = await userCollection.insertOne({
      _id: new ObjectId(),
      ...dto,
      isConfirmed: true,
      confirmation: { confirmationCode: '', expirationDate: new Date(0) },
    });
    return result.insertedId ? result.insertedId.toString() : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async findByEmail(email: string): Promise<string | null> {
    const result = await userCollection.findOne({ email });
    return result ? result.email : null;
  }

  async findByLogin(login: string): Promise<string | null> {
    const result = await userCollection.findOne({ login });
    return result ? result.login : null;
  }
}
