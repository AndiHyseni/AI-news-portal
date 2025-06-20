export interface ApiError {
  errorMessage?: ErrorMessage;
  statusMessage?: string;
  statusIsOk?: boolean;
  statusCode?: string;
}

export enum ErrorMessage {
  MORE_CARACTERS = "There need to be more than 20 characters",
  PASSWORD_MATCH = "Must match with the password",
}
