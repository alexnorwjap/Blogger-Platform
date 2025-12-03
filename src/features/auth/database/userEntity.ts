import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { add } from 'date-fns';
import { randomUUID } from 'crypto';

type User = {
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
  recoveryCode?: string;
  recoveryCodeExpirationDate?: Date;
};

interface UserMethods {
  confirmUser(): void;
  resetConfirmationCode(): void;
  updatePassword(hashedPassword: string): void;
}
interface UserStaticsMethods {
  createUser(dto: InputRegistrationDto, password: string): UserDocument;
  createUserAdmin(dto: InputRegistrationDto, password: string): UserDocument;
  setRecoveryCode(user: UserDocument): void;
}

type UserDocument = HydratedDocument<User, UserMethods>;
type UserModel = Model<User, {}, UserMethods> & UserStaticsMethods;

const userSchema = new mongoose.Schema<User, UserModel, UserMethods>({
  email: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  isConfirmed: { type: Boolean, required: true, default: false },
  confirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  recoveryCode: { type: String, required: false },
  recoveryCodeExpirationDate: { type: Date, required: false },
});

class UserEntity {
  declare login: string;
  declare email: string;
  declare password: string;
  declare isConfirmed: boolean;
  declare confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
  declare recoveryCode?: string;
  declare recoveryCodeExpirationDate?: Date;

  static createUser(dto: InputRegistrationDto, hashedPassword: string): UserDocument {
    return new UserModel({
      login: dto.login,
      email: dto.email,
      password: hashedPassword,
      confirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { minutes: 15 }),
      },
    });
  }
  static createUserAdmin(dto: InputRegistrationDto, hashedPassword: string): UserDocument {
    return new UserModel({
      login: dto.login,
      email: dto.email,
      password: hashedPassword,
      isConfirmed: true,
      confirmation: {
        confirmationCode: 'none',
        expirationDate: new Date(0),
      },
    });
  }
  static setRecoveryCode(user: UserDocument): void {
    user.recoveryCode = randomUUID();
    user.recoveryCodeExpirationDate = add(new Date(), { minutes: 15 });
  }

  confirmUser(): void {
    this.isConfirmed = true;
    this.confirmation = {
      confirmationCode: 'none',
      expirationDate: new Date(0),
    };
  }

  resetConfirmationCode(): void {
    this.isConfirmed = false;
    this.confirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { minutes: 15 }),
    };
  }

  updatePassword(hashedPassword: string): void {
    this.password = hashedPassword;
    this.recoveryCode = '';
    this.recoveryCodeExpirationDate = new Date(0);
  }
}

userSchema.loadClass(UserEntity);

const UserModel = model<User, UserModel>('User', userSchema);

export { User, UserDocument, UserModel };
