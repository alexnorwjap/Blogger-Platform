import { inputCreateDto } from '../database/entity';
import { authModel } from '../model/authModel';
import { DeviceDto, InputConfirmationDto } from '../repository/dto/authDto';

export interface AuthRepository {
  create: (dto: inputCreateDto) => Promise<authModel>;
  update: (userId: string, dto: InputConfirmationDto) => Promise<boolean>;
  delete: (userId: string) => Promise<boolean>;

  createDevice: (userId: string, device: DeviceDto) => Promise<boolean>;
  updateDevice: (userId: string, device: DeviceDto) => Promise<boolean>;
  deleteDevice: (deviceId: string) => Promise<boolean>;
}
