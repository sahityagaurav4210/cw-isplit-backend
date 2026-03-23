import type { CookieOptions, Request } from 'express';
import type mongoose from 'mongoose';
export type * from './models.interface';
export type * from './dtos.interfaces';
export type * from './configs.interfaces';

export interface CWISplitRequest extends Request {
  reqId: string;
}

export interface CWISplitAuthRequest extends CWISplitRequest {
  userId: string;
}

export type DBObjectId = mongoose.Types.ObjectId;

export interface IAppCookieOptions {
  accessToken: CookieOptions;
  refreshToken: CookieOptions;
}

export interface IServiceResponse<T> {
  success: boolean;
  data?: T;
}
