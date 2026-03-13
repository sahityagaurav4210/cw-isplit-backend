import type { ApiStatus, HttpCodes } from "../constants/api.constants";

export class CWISplitAppException extends Error {
  public code: HttpCodes;
  public status: ApiStatus;

  constructor(
    status: ApiStatus,
    message: string,
    code: HttpCodes,
    context?: string,
  ) {
    super(message);
    this.name = "CWISplitAppException";
    this.code = code;
    this.status = status;
    this.cause = context;
  }
}
