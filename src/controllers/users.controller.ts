import type { Request, Response } from 'express';
import { createUser, editUserProfile, getUserProfile } from '../services';
import CWISplitAPIReply from '../api';
import AppConstants from '../constants';
import type { CWISplitAuthRequest, CWISplitRequest } from '../interfaces';
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

export async function editUserProfileController(req: Request, res: Response): Promise<Response> {
  const reqId = (req as CWISplitAuthRequest).reqId;
  const userId = (req as CWISplitAuthRequest).userId;

  const logger = LoggerManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const reply = new CWISplitAPIReply();
  const payload = req.body;

  logger.info(
    `Req Id: ${reqId}, Message: A request to edit user profile has been received, Payload: ${JSON.stringify(payload)}`
  );

  const serviceReply = await editUserProfile(userId, !!req.file, req?.file?.filename || '', payload);

  if (!serviceReply.success) {
    logger.warn(`Req Id: ${reqId}, Message: Failed to edit user profile, Payload: ${JSON.stringify(payload)}`);

    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiDetails = { message: 'Failed to update user profile' };
    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  logger.info(`Req Id: ${reqId}, Message: User profile updated successfully, Payload: ${JSON.stringify(serviceReply.data)}`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: 'Profile updated successfully', data: serviceReply.data };
  reply.apiReqId = reqId;

  return res.status(HttpCodes.OK).json(reply);
}

export async function getUserProfileController(req: Request, res: Response): Promise<Response> {
  const reqId = (req as CWISplitAuthRequest).reqId;
  const userId = (req as CWISplitAuthRequest).userId;

  const logger = LoggerManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const reply = new CWISplitAPIReply();

  logger.info(`Req Id: ${reqId}, Message: A request to get user profile has been received`);

  const serviceReply = await getUserProfile(userId);

  if (!serviceReply.success) {
    logger.warn(`Req Id: ${reqId}, Message: Failed to get user profile`);
  }

  logger.info(`Req Id: ${reqId}, Message: User profile fetched successfully, Payload: ${JSON.stringify(serviceReply.data)}`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: 'Profile fetched successfully', data: serviceReply.data };
  reply.apiReqId = reqId;

  return res.status(HttpCodes.OK).json(reply);
}
