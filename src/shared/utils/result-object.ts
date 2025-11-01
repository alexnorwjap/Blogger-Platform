import { HTTP_STATUS_CODES } from '../constants/http-status';

type StatusType = keyof typeof HTTP_STATUS_CODES;

type ExtensionType = {
  field: string | null;
  message: string;
};

export type Result<T = null> = {
  status: StatusType;
  errorMessage?: string;
  extensions?: ExtensionType[];
  data: T;
};

export function createResult<T>(
  status: StatusType,
  data: T,
  errorMessage?: string,
  extensions?: ExtensionType[]
): Result<T> {
  return {
    status: status,
    errorMessage: errorMessage,
    extensions: extensions,
    data: data,
  };
}
