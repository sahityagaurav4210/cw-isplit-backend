import type { Response } from 'express';
import CWISplitAPIReply from '../api/index';
import { ApiStatus, HttpCodes } from '../constants/api.constants';
import { appHealthService, pingService } from '../services/app.services';
import type { CWISplitRequest } from '../interfaces';

export function pingController(request: CWISplitRequest, response: Response): Response {
  const reply = new CWISplitAPIReply();

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: pingService() };
  reply.apiReqId = request.reqId;

  return response.status(HttpCodes.OK).json(reply);
}

export function appHealthController(request: CWISplitRequest, response: Response): Response {
  const reply = new CWISplitAPIReply();

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: 'App is healthy', data: appHealthService() };
  reply.apiReqId = request.reqId;

  return response.status(HttpCodes.OK).json(reply);
}
