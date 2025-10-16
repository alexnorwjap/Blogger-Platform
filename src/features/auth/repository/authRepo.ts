import { inputCreateDto } from '../database/entity';
import { authModel } from '../model/authModel';
import { InputConfirmationDto } from '../repository/dto/authDto';

export interface AuthRepository {
  create: (dto: inputCreateDto) => Promise<authModel>;
  update: (userId: string, dto: InputConfirmationDto) => Promise<boolean>;
  delete: (userId: string) => Promise<boolean>;
}
