import type { NextFunction, Request, Response } from 'express';
import type { CWISplitAuthRequest, CWISplitRequest, ILoginUserDto } from '../interfaces';
import CWISplitAPIReply from '../api';
import AppConstants, { AppGlobalPatterns } from '../constants';
import Joi from 'joi';
import Patterns from '@book-junction/patterns';
import { RequestDTOValidationMessagesHelper } from '../helpers';
import { JwtManager, LoggerManager } from '../config';
import { SessionModel, UserModel } from '../db';

export function validateUserLoginDTOMiddleware(request: Request, response: Response, next: NextFunction): void | Response {
  const payload = request.body as unknown as ILoginUserDto;
  const { email, password, platform, deviceType, deviceOs, deviceModel } = payload;
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const { PlatformType } = AppConstants.getSessionConstants();
  const reply = new CWISplitAPIReply();

  if (!email || !password || !platform || !deviceType || !deviceOs) {
    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'All fields are required' };

    return response.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  if ((platform === PlatformType.IOS || platform === PlatformType.ANDROID) && !deviceModel) {
    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'Device model is required' };

    return response.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  const schema = Joi.object<ILoginUserDto>().keys({
    email: Joi.string()
      .required()
      .pattern(Patterns.common.email)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().email),
    password: Joi.string()
      .required()
      .pattern(Patterns.common.password)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().password),
    platform: Joi.string()
      .required()
      .pattern(AppGlobalPatterns.PLATFORM_PATTERN)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().platform),
    deviceType: Joi.string()
      .required()
      .pattern(AppGlobalPatterns.DEVICE_TYPE_PATTERN)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().deviceType),
    deviceOs: Joi.string()
      .required()
      .pattern(AppGlobalPatterns.DEVICE_OS_PATTERN)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().deviceOs),
    deviceModel: Joi.string()
      .optional()
      .pattern(AppGlobalPatterns.DEVICE_MODEL_PATTERN)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserLoginDTO().deviceModel),
  });

  const result = schema.validate(payload);

  if (result.error) {
    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: result.error.message, data: result.error.details[0] };

    return response.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  next();
}

export async function authRequest(request: Request, response: Response, next: NextFunction): Promise<void | Response> {
  const logger = LoggerManager.getInstance();
  const jwtManager = JwtManager.getInstance();

  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const reply = new CWISplitAPIReply();

  logger.info('Validating incoming request...');

  let authHeader = request.signedCookies.accessToken || request.headers['authorization'];

  if (!authHeader) {
    logger.debug('No authentication token found in request headers or cookies.');

    reply.apiStatus = ApiStatus.UNAUTHORIZED;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'Invalid identity.' };

    return response.status(HttpCodes.UNAUTHORIZED).json(reply);
  }

  if (authHeader.startsWith('Bearer ')) {
    authHeader = authHeader.slice(7, authHeader.length);
  }

  logger.debug('Authentication token found, proceeding with request validation.');

  const userIdentityPayload = jwtManager.decodeToken(authHeader, jwtManager.accessSecretKey);

  if (!userIdentityPayload || typeof userIdentityPayload === 'string' || !userIdentityPayload.email) {
    logger.error('Failed to decode authentication token or token does not contain email.');

    reply.apiStatus = ApiStatus.UNAUTHORIZED;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'Invalid identity.' };

    return response.status(HttpCodes.UNAUTHORIZED).json(reply);
  }

  const email = userIdentityPayload.email;
  const user = await UserModel.findOne({ email, isBlocked: false, isDeleted: false });

  if (!user) {
    logger.error('User not found or is blocked/deleted.');

    reply.apiStatus = ApiStatus.UNAUTHORIZED;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'Invalid identity.' };

    return response.status(HttpCodes.UNAUTHORIZED).json(reply);
  }

  const userSession = await SessionModel.findOne({ userId: user._id, isLoggedIn: true });

  if (!userSession) {
    logger.error('User session not found or not logged in.');

    reply.apiStatus = ApiStatus.UNAUTHORIZED;
    reply.apiReqId = (request as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'Invalid identity.' };

    return response.status(HttpCodes.UNAUTHORIZED).json(reply);
  }

  (request as CWISplitAuthRequest).userId = userSession.userId.toString();
  logger.info('User authenticated successfully, providing access to requested resource.');
  next();
}
