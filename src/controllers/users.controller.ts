import type { Request, Response } from 'express';
import { createUser } from '../services';
import CWISplitAPIReply from '../api';
import AppConstants from '../constants';
import type { CWISplitRequest } from '../interfaces';
import { LoggerManager } from '../config';
import { UtilsHelper } from '../helpers';

export async function createUserController(req: Request, res: Response) {
  const reply = new CWISplitAPIReply();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const logger = LoggerManager.getInstance();
  const reqId = (req as CWISplitRequest).reqId;
  const utils = new UtilsHelper();

  logger.info(
    `Req Id: ${reqId}, Message: A request from ip ${req.ip} has been received to create a new user, Payload: ${JSON.stringify(req.body)}`
  );

  const user = await createUser(req.body);

  logger.info(`Req Id: ${reqId}, Message: User created successfully, Payload: ${JSON.stringify(user)}`);

  reply.apiStatus = ApiStatus.CREATED;
  reply.apiDetails = { message: 'User registered successfully', data: utils.getSafeUserPayload(user) };
  reply.apiReqId = reqId;

  return res.status(HttpCodes.CREATED).json(reply);
}
