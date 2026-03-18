import type { Request } from 'express';
export type * from './models.interface';
export type * from './dtos.interfaces';

export interface CWISplitRequest extends Request {
  reqId: string;
}
