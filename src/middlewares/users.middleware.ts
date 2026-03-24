import Joi from 'joi';
import type { NextFunction, Request, Response } from 'express';
import type { CWISplitRequest, ICreateUserDto, IEditUserProfileDto } from '../interfaces';
import Patterns from '@book-junction/patterns';
import { RequestDTOValidationMessagesHelper } from '../helpers';
import CWISplitAPIReply from '../api';
import { ApiStatus, HttpCodes } from '../constants/api.constants';

export function validateUserRegistrationDTOMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  const payload = req.body as unknown as ICreateUserDto;
  const schema = Joi.object<ICreateUserDto>().keys({
    name: Joi.string()
      .required()
      .pattern(Patterns.common.name)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().name),
    email: Joi.string()
      .required()
      .pattern(Patterns.common.email)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().email),
    password: Joi.string()
      .required()
      .pattern(Patterns.common.password)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().password),
    phone: Joi.string()
      .optional()
      .pattern(Patterns.common.phone)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().phone),
  });

  const result = schema.validate(payload);

  if (result.error) {
    const reply = new CWISplitAPIReply();

    reply.apiStatus = ApiStatus.SUCCESS;
    reply.apiReqId = (req as CWISplitRequest).reqId;
    reply.apiDetails = { message: result.error.message, data: result.error.details[0] };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  next();
}

export function validateEditUserProfileDTOMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  const payload = req.body as unknown as Partial<IEditUserProfileDto>;
  const schema = Joi.object<Partial<IEditUserProfileDto>>().keys({
    name: Joi.string()
      .optional()
      .pattern(Patterns.common.name)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().name),
    email: Joi.string()
      .optional()
      .pattern(Patterns.common.email)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().email),
    phone: Joi.string()
      .optional()
      .pattern(Patterns.common.phone)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForUserRegistrationDTO().phone),
  });

  const result = schema.validate(payload);
  const { name, email, phone } = payload || {};

  if (!name && !email && !phone && !req.file) {
    const reply = new CWISplitAPIReply();

    reply.apiStatus = ApiStatus.SUCCESS;
    reply.apiReqId = (req as CWISplitRequest).reqId;
    reply.apiDetails = { message: 'At least one field is required to update profile.' };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  if (result.error) {
    const reply = new CWISplitAPIReply();

    reply.apiStatus = ApiStatus.SUCCESS;
    reply.apiReqId = (req as CWISplitRequest).reqId;
    reply.apiDetails = { message: result.error.message, data: result.error.details[0] };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  next();
}
