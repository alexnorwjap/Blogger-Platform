import { AuthDto } from '../repository/dto/authDto';
import { AuthRepository } from '../repository/authRepo';
import bcrypt from 'bcryptjs';
import { AuthRepoImpl } from '../database/authRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { randomUUID } from 'crypto';
import { authModel } from '../model/authModel';
import { add } from 'date-fns/add';
import { jwtService } from '../adapter/jwtService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { inExistingUser } from './helpers/inExistingUser';
import { checkPassword, prepareDevice } from './helpers/checkPassword';
import { emailAdapter } from '../adapter/emailAdapter';
import { DeviceIdType, LoginRequestInfo, TokensType } from '../authType';
import { deviceService } from '../../device/service/deviceService';
import { deviceQueryRepository } from '../../device/repository/deviceQueryRepository';
import { DeviceModel } from '../../device/model/deviceModel';
export class AuthService {
  constructor(readonly authRepository: AuthRepoImpl) {}
  // updated
  async login(dto: AuthDto, reqInfo: LoginRequestInfo): Promise<Result<TokensType | null>> {
    const user = await this.authRepository.findByLoginOrEmail(dto);
    if (!user) {
      return createResult('UNAUTHORIZED', null);
    }

    const isPasswordCorrect = await checkPassword(dto.password, user.password);
    if (!isPasswordCorrect) {
      return createResult('UNAUTHORIZED', null);
    }

    const dataForToken = await deviceService.createDevice({
      ip: reqInfo.ip,
      title: reqInfo.title,
      userId: user.userId,
    });

    if (!dataForToken) {
      return createResult('BAD_REQUEST', null, 'Try Later, Please, DB Error');
    }

    const accessToken = jwtService.generateToken(user.userId);
    const refreshToken = jwtService.generateRefreshToken(dataForToken);
    return createResult('SUCCESS', {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  // updated
  async refreshToken(device: DeviceModel, deviceId: string): Promise<Result<TokensType | null>> {
    const newDate = new Date();
    const result = await deviceService.updateDevice(deviceId, newDate);
    if (!result) {
      return createResult('UNAUTHORIZED', null);
    }
    const accessToken = jwtService.generateToken(device.userId);
    const refreshToken = jwtService.generateRefreshToken({
      id: deviceId,
      lastActiveDate: newDate,
    });
    return createResult('SUCCESS', {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async registration(
    dto: InputRegistrationDto,
    existingUser: authModel | null
  ): Promise<Result<{ confirmationCode: string } | null>> {
    if (existingUser) {
      return inExistingUser(existingUser, dto);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const confirmationCode = randomUUID();
    await this.authRepository
      .create({
        login: dto.login,
        password: hashedPassword,
        email: dto.email,
        createdAt: new Date(),
        isConfirmed: false,
        confirmation: {
          confirmationCode: confirmationCode,
          expirationDate: add(new Date(), { minutes: 15 }),
        },
      })
      .catch(e => {
        throw new Error('registration error');
      });

    emailAdapter.sendEmail(dto.email, confirmationCode).catch(e => {
      throw new Error('email sending error');
    });

    return createResult('NO_CONTENT', {
      confirmationCode: confirmationCode,
    });
  }

  async registrationConfirmation(user: authModel): Promise<Result<boolean | null>> {
    if (!user || user.isConfirmed) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'Invalid confirmation code or user already confirmed', field: 'code' },
      ]);
    }
    if (user.confirmation.expirationDate.getTime() < Date.now()) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'Confirmation code expired', field: 'code' },
      ]);
    }
    const result = await this.authRepository.update(user.userId, {
      isConfirmed: true,
      confirmation: {
        confirmationCode: user.confirmation.confirmationCode,
        expirationDate: new Date(0),
      },
    });
    return result
      ? createResult('NO_CONTENT', true)
      : createResult('BAD_REQUEST', null, 'Try Later, Please', [
          { field: 'confirmation', message: 'Something went wrong, try later' },
        ]);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.authRepository.delete(userId);
  }

  async registrationEmailResending(user: authModel): Promise<Result<string | null>> {
    if (!user) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'User with this email not found or already confirmed', field: 'email' },
      ]);
    }
    if (user.isConfirmed) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'User with this email already confirmed', field: 'email' },
      ]);
    }
    const confirmationCode = randomUUID();
    const result = await this.authRepository.update(user.userId, {
      isConfirmed: false,
      confirmation: {
        confirmationCode: confirmationCode,
        expirationDate: add(new Date(), { minutes: 15 }),
      },
    });
    return result
      ? createResult('NO_CONTENT', confirmationCode)
      : createResult('BAD_REQUEST', null, 'errorsMessages', [
          { field: 'confirmation-code', message: 'Something went wrong, try later' },
        ]);
  }

  // updated
  async logout(deviceId: string): Promise<Result<boolean>> {
    const result = await deviceService.deleteDevice(deviceId);
    return result.data
      ? createResult('NO_CONTENT', result.data)
      : createResult('BAD_REQUEST', result.data);
  }
}

export const authService = new AuthService(new AuthRepoImpl());
