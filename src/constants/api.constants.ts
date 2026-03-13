export enum ApiStatus {
  SUCCESS = "success",
  CREATED = "created",
  BAD_REQUEST = "bad_request",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  INTERNAL_SERVER_ERROR = "server_error",
  SERVICE_UNAVAILABLE = "service_unavailable",
  GATEWAY_TIMEOUT = "gateway_timeout",
  UNSET = "unset",
}

export enum HttpCodes {
  OK = 200,
  CREATED = 201,
  UPDATED = 204,
  DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export interface ApiDetails {
  message: string;
  data?: any;
}
