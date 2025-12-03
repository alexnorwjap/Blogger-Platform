import { UsersRepository } from '../../../repositories/usersRepository';
import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../../../../auth/database/userEntity';
@injectable()
export class UsersRepoImpl implements UsersRepository {
  async save(user: UserDocument): Promise<UserDocument> {
    return await user.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id);
  }

  async findByLoginOrEmail(login: string, email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ $or: [{ login }, { email }] });
  }
}
