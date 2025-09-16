export type ValidationErrorType = {
  field: string;
  message: string;
};

export type WrapValidErrorsType = {
  errorsMessages: ValidationErrorType[];
};
