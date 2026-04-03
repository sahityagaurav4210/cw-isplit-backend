import type { NextFunction, Request, Response } from 'express';
import type { IVerifyPhoneNumberDto } from '../interfaces';
import CWISplitAPIReply from '../api';
import AppConstants from '../constants';
import { RequestManager } from '../config';
import RequestDTOValidationMessagesHelper from '../helpers/validations.helpers';
import Joi from 'joi';

export function validateVerifyPhoneNumberDTO(req: Request, res: Response, next: NextFunction): void | Response {
  const { otp } = req.body as IVerifyPhoneNumberDto;
  const reqId = RequestManager.getCurrentReqId();
  const reply = new CWISplitAPIReply();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  if (!otp) {
    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = reqId;
    reply.apiDetails = { message: 'OTP is required' };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  const verifyPhoneNumberDTOValidationSchema = Joi.object<IVerifyPhoneNumberDto>({
    otp: Joi.string()
      .required()
      .length(6)
      .pattern(/^[0-9]{6}$/)
      .messages(RequestDTOValidationMessagesHelper.getValidationMessageForVerifyPhoneNumberDTO()),
  });

  const result = verifyPhoneNumberDTOValidationSchema.validate(req.body);

  if (result.error) {
    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = reqId;
    reply.apiDetails = { message: result.error.message, data: result.error.details[0] };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  next();
}
