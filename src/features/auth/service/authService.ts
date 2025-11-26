import { AuthDto } from '../repository/dto/authDto';
import { AuthRepoImpl } from '../database/authRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { JwtService } from '../adapter/jwtService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { EmailAdapter } from '../adapter/emailAdapter';
import { LoginRequestInfo, TokensType } from '../authType';
import { DeviceService } from '../../device/service/deviceService';
import { DeviceModel } from '../../device/model/deviceModel';
import { inject, injectable } from 'inversify';
import { BcryptService } from '../adapter/bcryptService';
import { AuthModelEntity } from '../database/authEntity';

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

  async refreshToken(deviceId: string): Promise<Result<TokensType | null>> {
    const result = await this.deviceService.updateDevice(deviceId);
    if (!result) return createResult('UNAUTHORIZED', null);

    const accessToken = this.jwtService.generateToken(result.userId);
    const refreshToken = this.jwtService.generateRefreshToken({
      deviceId: result.id,
      lastActiveDate: result.lastActiveDate,
    });
    return createResult('SUCCESS', {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async registration(dto: InputRegistrationDto): Promise<Result<boolean | null>> {
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
    const user = new AuthModelEntity({
      login: dto.login,
      password: hashedPassword,
      email: dto.email,
      confirmation: {
        confirmationCode: confirmationCode,
        expirationDate: add(new Date(), { minutes: 15 }),
      },
    });
    await this.authRepository.save(user);

    this.emailAdapter.sendEmail(dto.email, confirmationCode).catch(e => {
      throw new Error('email sending error');
    });

    return createResult('NO_CONTENT', true);
  }

  async registrationConfirmation(confirmationCode: string): Promise<Result<boolean | null>> {
    const user = await this.authRepository.findByConfirmationCode(confirmationCode);

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

    user.isConfirmed = true;
    user.confirmation = {
      confirmationCode: 'none',
      expirationDate: new Date(0),
    };
    await this.authRepository.save(user);
    // const result = await this.authRepository.update(user.userId, {
    //   isConfirmed: true,
    //   confirmation: {
    //     confirmationCode: user.confirmation.confirmationCode,
    //     expirationDate: new Date(0),
    //   },
    // });
    return createResult('NO_CONTENT', true);
  }

  // async deleteUser(userId: string): Promise<boolean> {
  //   return await this.authRepository.delete(userId);
  // }

  async registrationEmailResending(email: string): Promise<Result<boolean | null>> {
    const user = await this.authRepository.findByEmail(email);

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
    user.isConfirmed = false;
    user.confirmation = {
      confirmationCode: confirmationCode,
      expirationDate: add(new Date(), { minutes: 15 }),
    };
    const result = await this.authRepository.save(user);
    this.emailAdapter.sendEmail(result.email, confirmationCode).catch(e => {
      throw new Error('email sending error');
    });

    return createResult('NO_CONTENT', true);
  }

  async logout(deviceId: string): Promise<Result<boolean>> {
    const result = await this.deviceService.deleteDevice(deviceId);
    return result.data
      ? createResult('NO_CONTENT', result.data)
      : createResult('BAD_REQUEST', result.data);
  }

  async passwordRecoveryCode(email: string): Promise<Result<null>> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) return createResult('NO_CONTENT', null);

    const recoveryCode = randomUUID();
    user.recoveryCode = recoveryCode;
    user.recoveryCodeExpirationDate = add(new Date(), { minutes: 15 });
    await this.authRepository.save(user);
    this.emailAdapter.sendPasswordRecoveryEmail(user.email, recoveryCode).catch(e => {
      throw new Error('email sending error');
    });
    return createResult('NO_CONTENT', null);
  }

  async passwordRecovery(dto: {
    recoveryCode: string;
    newPassword: string;
  }): Promise<Result<boolean | null>> {
    const user = await this.authRepository.findByRecoveryCode(dto.recoveryCode);
    if (!user)
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { field: 'recoveryCode', message: 'Invalid recovery code' },
      ]);

    if (user.recoveryCodeExpirationDate!.getTime() < Date.now()) {
      return createResult('BAD_REQUEST', null);
    }

    const hashedPassword = await this.bcryptService.hashPassword(dto.newPassword);
    user.password = hashedPassword;
    user.recoveryCode = '';
    user.recoveryCodeExpirationDate = new Date(0);
    await this.authRepository.save(user);

    return createResult('NO_CONTENT', true);
  }
}
