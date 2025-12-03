import { AuthDto } from '../repository/dto/authDto';
import { AuthRepoImpl } from '../database/authRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { JwtService } from '../adapter/jwtService';
import { createResult, Result } from '../../../shared/utils/result-object';
import { EmailAdapter } from '../adapter/emailAdapter';
import { LoginRequestInfo, TokensType } from '../authType';
import { DeviceService } from '../../device/service/deviceService';
import { inject, injectable } from 'inversify';
import { BcryptService } from '../adapter/bcryptService';
import { UserModel } from '../database/userEntity';

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
      userId: user.id,
    });

    const accessToken = this.jwtService.generateToken(user.id);
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
      const field = existingUser.login === dto.login ? 'login' : 'email';
      const message = `User with this ${field} already exists`;
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { field: field, message: message },
      ]);
    }

    const hashedPassword = await this.bcryptService.hashPassword(dto.password);
    const user = UserModel.createUser(dto, hashedPassword);
    await this.authRepository.save(user);

    this.emailAdapter.sendEmail(user.email, user.confirmation.confirmationCode).catch(e => {
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
    const isCodeExpired = user.confirmation.expirationDate.getTime() < Date.now();
    if (isCodeExpired) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'Confirmation code expired', field: 'code' },
      ]);
    }

    user.confirmUser();
    await this.authRepository.save(user);

    return createResult('NO_CONTENT', true);
  }

  async registrationEmailResending(email: string): Promise<Result<boolean | null>> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'User with this email not found', field: 'email' },
      ]);
    }
    if (user.isConfirmed) {
      return createResult('BAD_REQUEST', null, 'errorsMessages', [
        { message: 'User with this email already confirmed', field: 'email' },
      ]);
    }

    user.resetConfirmationCode();
    await this.authRepository.save(user);

    this.emailAdapter.sendEmail(user.email, user.confirmation.confirmationCode).catch(e => {
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

    UserModel.setRecoveryCode(user);
    await this.authRepository.save(user);
    this.emailAdapter.sendPasswordRecoveryEmail(user.email, user.recoveryCode!).catch(e => {
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
    user.updatePassword(hashedPassword);
    await this.authRepository.save(user);

    return createResult('NO_CONTENT', true);
  }
}
