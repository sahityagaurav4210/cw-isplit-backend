import type { NextFunction, Request, Response } from 'express';
import CWISplitAPIReply from '../api/index';
import { ApiStatus, HttpCodes } from '../constants/api.constants';
import { CWISplitAppException } from '../exceptions/app.exception';
import { LoggerManager, RequestManager } from '../config';
import type { CWISplitRequest } from '../interfaces';

export function appGlobalErrHandlerMiddleware(err: unknown, request: Request, response: Response, next: NextFunction) {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const reqId = (request as CWISplitRequest).reqId;

  if (err instanceof CWISplitAppException) {
    reply.apiStatus = err.status;
    reply.apiDetails = { message: err.message };
    reply.apiReqId = reqId;

    response.status(err.code).json(reply);

    logger.http(
      `Req Id: ${reqId}, Message: An error occured while processing an http request, Error: ${err.message}, Stack: ${err.stack}, Context: ${err.cause}`
    );
    return;
  }

  if (err instanceof Error) {
    logger.error(`Req Id: ${reqId}, Message: ${err.message}, Stack: ${err.stack}, Context: ${err.cause}`);

    reply.apiStatus = ApiStatus.INTERNAL_SERVER_ERROR;
    reply.apiDetails = { message: 'Something went wrong at our end, please try again' };
    reply.apiReqId = reqId;

    response.status(HttpCodes.INTERNAL_SERVER_ERROR).json(reply);
    return;
  }

  logger.error(`Req Id: ${reqId}, Message: Unknown error, Stack: unknown, Context: unknown`);

  reply.apiStatus = ApiStatus.INTERNAL_SERVER_ERROR;
  reply.apiDetails = { message: 'Something went wrong at our end, please try again' };
  reply.apiReqId = reqId;
  response.status(HttpCodes.INTERNAL_SERVER_ERROR).json(reply);
}

export async function appReqIdHandlerMiddleware(request: Request, response: Response, next: NextFunction) {
  (request as CWISplitRequest).reqId = RequestManager.getNextReqId();
  next();
}

export function appLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  const logger = LoggerManager.getInstance();
  const reqId = (request as CWISplitRequest).reqId;

  logger.http(
    `Req Id: ${reqId}, Message: An http request has been received from ip ${request.ip}., Method: ${request.method}, URL: ${request.url}.`
  );
  next();
}
