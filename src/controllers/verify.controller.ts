import type { Request, Response } from 'express';
import CWISplitAPIReply from '../api';
import { LoggerManager } from '../config';
import type { CWISplitAuthRequest, IVerifyPhoneNumberDto } from '../interfaces';
import { sendOtp, verifyPhoneNumber } from '../services';
import AppConstants from '../constants';

export async function sendOtpController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const reqId = (req as CWISplitAuthRequest).reqId;
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const userId = (req as CWISplitAuthRequest).userId;

  logger.info(`Req Id: ${reqId} - User ID: ${userId} - Sending OTP to phone number.`);

  const result = await sendOtp(userId);

  if (!result.success) logger.warn(`Req ID: ${reqId} - User ID: ${userId} - OTP sent failed.`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = reqId;
  reply.apiDetails = { message: 'OTP sent successfully' };

  return res.status(HttpCodes.OK).json(reply);
}

export async function verifyOtpController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const reqId = (req as CWISplitAuthRequest).reqId;
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const userId = (req as CWISplitAuthRequest).userId;
  const { otp } = req.body as IVerifyPhoneNumberDto;

  logger.info(`Req Id: ${reqId} - User ID: ${userId} - Verifying OTP for phone number.`);

  const result = await verifyPhoneNumber(userId, Number(otp));

  if (!result.success) logger.warn(`Req ID: ${reqId} - User ID: ${userId} - OTP verification failed.`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = reqId;
  reply.apiDetails = { message: 'Phone number verified successfully' };

  return res.status(HttpCodes.OK).json(reply);
}
