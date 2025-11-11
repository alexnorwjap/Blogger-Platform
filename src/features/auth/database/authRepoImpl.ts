import { userCollection } from '../../../db/mongo.db';
import { AuthRepository } from '../repository/authRepo';
import { AuthMapper } from './authMapper';
import { authModel } from '../model/authModel';
import { inputCreateDto } from './entity';
import { ObjectId } from 'mongodb';
import {
  InputConfirmationDto,
  AuthDto,
  InputRegistrationDto,
  recoveryCodeDto,
  passwordRecoveryDto,
} from '../repository/dto/authDto';

export class AuthRepoImpl implements AuthRepository {
  async findByLoginOrEmail(dto: AuthDto | InputRegistrationDto): Promise<authModel | null> {
    if ('loginOrEmail' in dto) {
      const user = await userCollection.findOne({
        $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
      });
      if (!user) {
        return null;
      }
      return AuthMapper.toService(user);
    }
    if ('login' in dto && 'email' in dto) {
      const user = await userCollection.findOne({
        $or: [{ login: dto.login }, { email: dto.email }],
      });
      if (!user) {
        return null;
      }
      return AuthMapper.toService(user);
    }
    return null;
  }
  async create(dto: inputCreateDto): Promise<authModel> {
    const user = await userCollection.insertOne({ _id: new ObjectId(), ...dto });
    return AuthMapper.toService({ _id: user.insertedId, ...dto });
  }
  async update(userId: string, dto: InputConfirmationDto | passwordRecoveryDto): Promise<boolean> {
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...dto } }
    );
    return result.modifiedCount > 0;
  }
  async delete(userId: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }

  async addRecoveryCode(userId: string, dto: recoveryCodeDto): Promise<boolean> {
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...dto } }
    );
    return result.modifiedCount > 0;
  }
}
