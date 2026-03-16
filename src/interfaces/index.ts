import type { Request } from "express";

export interface CWISplitRequest extends Request {
  reqId: string;
}
