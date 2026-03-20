import type { NextFunction, Request, Response } from 'express';
import type { CWISplitRequest, ILoginUserDto } from '../interfaces';
import CWISplitAPIReply from '../api';
import AppConstants, { AppGlobalPatterns } from '../constants';
import Joi from 'joi';
import Patterns from '@book-junction/patterns';
import { RequestDTOValidationMessagesHelper } from '../helpers';

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
      .allow(['', null, undefined])
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
