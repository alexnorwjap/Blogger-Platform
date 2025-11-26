import { UsersRepository } from '../../../repositories/usersRepository';
import { InputUserDto } from '../../../repositories/dto/commandsUserDto';
import { injectable } from 'inversify';
import { userModel } from '../../../../../db/mongo.db';
import { AuthDocument, entityDB } from '../../../../auth/database/authEntity';
import { AuthModelEntity } from '../../../../auth/database/authEntity';
@injectable()
export class UsersRepoImpl implements UsersRepository {
  async create(dto: InputUserDto): Promise<string | null> {
    try {
      const result = await userModel.create({
        ...dto,
        isConfirmed: true,
        confirmation: { confirmationCode: 'none', expirationDate: new Date(0) },
      });
      return result._id ? result._id.toString() : null;
    } catch (error) {
      return null;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const result = await userModel.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  }

  async findByEmail(email: string): Promise<string | null> {
    try {
      const result = await userModel.findOne({ email }).lean();
      return result ? result.email : null;
    } catch (error) {
      return null;
    }
  }

  async findByLogin(login: string): Promise<string | null> {
    try {
      const result = await userModel.findOne({ login }).lean();
      return result ? result.login : null;
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: string): Promise<AuthDocument | null> {
    return await AuthModelEntity.findById(id);
  }
}
