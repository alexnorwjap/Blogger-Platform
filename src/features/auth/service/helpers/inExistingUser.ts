import { HTTP_STATUS_CODES } from '../../../../shared/constants/http-status';
import { Result } from '../../../../shared/utils/result-object';
import { authModel } from '../../model/authModel';
import { InputRegistrationDto } from '../../repository/dto/authDto';
import { createResult } from '../../../../shared/utils/result-object';

export function inExistingUser(existingUser: authModel, dto: InputRegistrationDto): Result {
  const foundBy = existingUser.login === dto.login ? 'login' : 'email';
  return createResult('BAD_REQUEST', null, 'errorsMessages', [
    { field: foundBy, message: `User with this ${foundBy} already exists` },
  ]);
}
