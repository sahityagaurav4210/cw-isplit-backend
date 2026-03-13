import type { NextFunction, Request, Response } from "express";
import CWISplitAPIReply from "../api/index";
import { ApiStatus, HttpCodes } from "../constants/api.constants";
import { CWISplitAppException } from "../exceptions/app.exception";

export function appGlobalErrHandlerMiddleware(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const reply = new CWISplitAPIReply();

  if (err instanceof CWISplitAppException) {
    reply.apiStatus = err.status;
    reply.apiDetails = { message: err.message };
    reply.apiReqId = "req-id";

    response.status(err.code).json(reply);
    return;
  }

  reply.apiStatus = ApiStatus.INTERNAL_SERVER_ERROR;
  reply.apiDetails = { message: err.message };
  reply.apiReqId = "req-id";

  response.status(HttpCodes.INTERNAL_SERVER_ERROR).json(reply);
}
