import type { Request, Response } from 'express';
import type { CWISplitAuthRequest, CWISplitRequest, ILoginUserDto } from '../interfaces';
import { CookieManager, LoggerManager } from '../config';
import { generateNewAccessToken, getMe, login, logout } from '../services';
import AppConstants from '../constants';
import CWISplitAPIReply from '../api';

export async function loginController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const cookieManager = CookieManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const payload = req.body as ILoginUserDto;
  const ipAddress = req.ip || '0.0.0.0';
  const userAgent = req.header('user-agent');

  logger.info(`Login attempt for email: ${payload.email} from IP: ${ipAddress}`);

  const serviceReply = await login(payload, ipAddress, userAgent);

  if (!serviceReply.success) logger.warn(`Login failed for email: ${payload.email} from IP: ${ipAddress}.`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = (req as CWISplitRequest).reqId;
  reply.apiDetails = { message: 'Login successful', data: serviceReply.data };

  if (payload.platform === AppConstants.getSessionConstants().PlatformType.WEB) {
    res.cookie('accessToken', serviceReply?.data?.accessToken, cookieManager.accessToken);
    res.cookie('refreshToken', serviceReply?.data?.refreshToken, cookieManager.refreshToken);
  }

  return res.status(HttpCodes.OK).json(reply);
}

export async function logoutController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const cookieManager = CookieManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const userId = (req as CWISplitAuthRequest).userId;
  const ipAddress = req.ip || '0.0.0.0';

  logger.info(`Logout attempt for userId: ${userId} from IP: ${ipAddress}`);

  const serviceReply = await logout(userId);

  if (!serviceReply.success) logger.warn(`Logout failed for userId: ${userId} from IP: ${ipAddress}.`);

  res.clearCookie('accessToken', cookieManager.accessToken);
  res.clearCookie('refreshToken', cookieManager.refreshToken);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = (req as CWISplitAuthRequest).reqId;
  reply.apiDetails = { message: 'Logout successful' };

  return res.status(HttpCodes.OK).json(reply);
}

export async function getMeController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const logger = LoggerManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  let accessToken: string | undefined = req.signedCookies.accessToken || req.headers['authorization'];
  const ipAddress = req.ip || '0.0.0.0';

  if (typeof accessToken === 'string' && accessToken.startsWith('Bearer ')) {
    accessToken = accessToken.slice(7, accessToken.length);
  }

  logger.info(`GetMe attempt from IP: ${ipAddress}`);

  const serviceReply = await getMe(accessToken || '');

  if (!serviceReply.success) logger.warn(`GetMe failed from IP: ${ipAddress}.`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = (req as CWISplitAuthRequest).reqId;
  reply.apiDetails = { message: 'User details fetched successfully', data: serviceReply.data };
  return res.status(HttpCodes.OK).json(reply);
}

export async function generateNewAccessTokenController(req: Request, res: Response): Promise<Response> {
  const reply = new CWISplitAPIReply();
  const reqId = (req as CWISplitAuthRequest).reqId;
  const logger = LoggerManager.getInstance();
  const cookieManager = CookieManager.getInstance();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  let refreshToken: string | undefined =
    req.signedCookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
  const ipAddress = req.ip || '0.0.0.0';

  if (!refreshToken) {
    logger.warn(`Req Id: ${reqId} - GenerateNewAccessToken attempt without refresh token from IP: ${ipAddress}.`);

    reply.apiStatus = ApiStatus.BAD_REQUEST;
    reply.apiReqId = reqId;
    reply.apiDetails = { message: 'Invalid identity.' };

    return res.status(HttpCodes.BAD_REQUEST).json(reply);
  }

  logger.info(`Req Id: ${reqId} - GenerateNewAccessToken attempt from IP: ${ipAddress}`);

  const serviceReply = await generateNewAccessToken(refreshToken);

  if (!serviceReply.success) logger.warn(`Req Id: ${reqId} - GenerateNewAccessToken failed from IP: ${ipAddress}.`);

  res.cookie('accessToken', serviceReply?.data?.accessToken, cookieManager.accessToken);
  logger.info(`Req Id: ${reqId} - New access token generated successfully for IP: ${ipAddress}.`);

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiReqId = reqId;
  reply.apiDetails = { message: 'New access token generated successfully', data: serviceReply.data };
  return res.status(HttpCodes.OK).json(reply);
}
