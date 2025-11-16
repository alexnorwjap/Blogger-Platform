import { AuthDto } from '../repository/dto/authDto';
import { AuthRepoImpl } from '../database/authRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { randomUUID } from 'crypto';
import { authModel } from '../model/authModel';
import { add } from 'date-fns/add';
import { JwtService } from '../adapter/jwtService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { EmailAdapter } from '../adapter/emailAdapter';
import { LoginRequestInfo, TokensType } from '../authType';
import { DeviceService } from '../../device/service/deviceService';
import { DeviceModel } from '../../device/model/deviceModel';
import { inject, injectable } from 'inversify';
import { BcryptService } from '../adapter/bcryptService';

@injectable()
export class AuthService {
  constructor(
    @inject(AuthRepoImpl) readonly authRepository: AuthRepoImpl,
    @inject(JwtService) readonly jwtService: JwtService,
    @inject(EmailAdapter) readonly emailAdapter: EmailAdapter,
    @inject(BcryptService) readonly bcryptService: BcryptService,
    @inject(DeviceService) readonly deviceService: DeviceService
  ) {}
  async login(dto: AuthDto, reqInfo: LoginRequestInfo): Promise<Result<TokensType | null>> {
    const user = await this.authRepository.findByLoginOrEmail(dto);
    if (!user) return createResult('UNAUTHORIZED', null);

    const isPasswordCorrect = await this.bcryptService.checkPassword(dto.password, user.password);
    if (!isPasswordCorrect) return createResult('UNAUTHORIZED', null);

    const dataForToken = await this.deviceService.createDevice({
      ip: reqInfo.ip,
      title: reqInfo.title,
      userId: user.userId,
    });

    const accessToken = this.jwtService.generateToken(user.userId);
    const refreshToken = this.jwtService.generateRefreshToken(dataForToken);
    return createResult('SUCCESS', {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async refreshToken(device: DeviceModel, deviceId: string): Promise<Result<TokensType | null>> {
    const newDate = new Date();
    const result = await this.deviceService.updateDevice(deviceId, newDate);
    if (!result) return createResult('UNAUTHORIZED', null);

    const accessToken = this.jwtService.generateToken(device.userId);
    const refreshToken = this.jwtService.generateRefreshToken({
      deviceId: deviceId,
      lastActiveDate: newDate,
    });
    return createResult('SUCCESS', {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async registration(
    dto: InputRegistrationDto
  ): Promise<Result<{ confirmationCode: string } | null>> {
    const existingUser = await this.authRepository.findByLoginOrEmail(dto);
    if (existingUser) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        {
          field: existingUser.login === dto.login ? 'login' : 'email',
          message: `User with this ${existingUser.login === dto.login ? 'login' : 'email'} already exists`,
        },
      ]);
    }

    const hashedPassword = await this.bcryptService.hashPassword(dto.password);
    const confirmationCode = randomUUID();
    await this.authRepository.create({
      login: dto.login,
      password: hashedPassword,
      email: dto.email,
      createdAt: new Date(),
      isConfirmed: false,
      confirmation: {
        confirmationCode: confirmationCode,
        expirationDate: add(new Date(), { minutes: 15 }),
      },
    });

    this.emailAdapter.sendEmail(dto.email, confirmationCode).catch(e => {
      throw new Error('email sending error');
    });

    return createResult('NO_CONTENT', {
      confirmationCode: confirmationCode,
    });
  }

  async registrationConfirmation(user: authModel | null): Promise<Result<boolean | null>> {
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
      ? createResult('NO_CONTENT', result)
      : createResult('BAD_REQUEST', result, 'Try Later, Please', [
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
    this.emailAdapter.sendEmail(user.email, confirmationCode).catch(e => {
      throw new Error('email sending error');
    });

    return result
      ? createResult('NO_CONTENT', confirmationCode)
      : createResult('BAD_REQUEST', null, 'errorsMessages', [
          { field: 'confirmation-code', message: 'Something went wrong, try later' },
        ]);
  }

  async logout(deviceId: string): Promise<Result<boolean>> {
    const result = await this.deviceService.deleteDevice(deviceId);
    return result.data
      ? createResult('NO_CONTENT', result.data)
      : createResult('BAD_REQUEST', result.data);
  }

  async passwordRecoveryCode(user: authModel): Promise<Result<boolean | null>> {
    const recoveryCode = randomUUID();
    const result = await this.authRepository.addRecoveryCode(user.userId, {
      recoveryCode: recoveryCode,
      recoveryCodeExpirationDate: add(new Date(), { minutes: 15 }),
    });
    this.emailAdapter.sendPasswordRecoveryEmail(user.email, recoveryCode).catch(e => {
      throw new Error('email sending error');
    });
    return result
      ? createResult('NO_CONTENT', result)
      : createResult('BAD_REQUEST', result, 'errorsMessages', [
          { field: 'confirmation-code', message: 'Something went wrong, try later' },
        ]);
  }

  async passwordRecovery(user: authModel, newPassword: string): Promise<Result<boolean | null>> {
    if (user.recoveryCodeExpirationDate.getTime() < Date.now()) {
      return createResult('BAD_REQUEST', null);
    }
    const hashedPassword = await this.bcryptService.hashPassword(newPassword);
    const result = await this.authRepository.update(user.userId, {
      password: hashedPassword,
      recoveryCode: '',
      recoveryCodeExpirationDate: new Date(0),
    });
    return result ? createResult('NO_CONTENT', result) : createResult('BAD_REQUEST', result);
  }
}
