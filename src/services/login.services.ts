import { JwtManager, LoggerManager } from '../config';
import AppConstants from '../constants';
import { SessionModel, UserModel } from '../db';
import { CWISplitAppException } from '../exceptions';
import type { ILoginUserDto, IServiceResponse } from '../interfaces';
import jwt, { type SignOptions } from 'jsonwebtoken';

export async function login(
  payload: ILoginUserDto,
  ipAddress: string,
  userAgent?: string
): Promise<IServiceResponse<Record<string, any>>> {
  const { email, password, deviceOs, deviceType, deviceModel } = payload;
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const {
    accessSecretKey,
    accessTokenExpiry,
    refreshSecretKey,
    refreshTokenExpiry,
    algorithm,
    issuer,
    getRefreshTokenExpiryInMs,
  } = JwtManager.getInstance();
  const commonJwtOptions: SignOptions = {
    algorithm,
    issuer,
  };
  const accessJwtOptions: SignOptions = {
    ...commonJwtOptions,
    expiresIn: accessTokenExpiry as any,
  };
  const refreshJwtOptions: SignOptions = {
    ...commonJwtOptions,
    expiresIn: refreshTokenExpiry as any,
  };

  const user = await UserModel.findOne({ email, isBlocked: false, isDeleted: false }).select('+password');

  if (!user) {
    throw new CWISplitAppException(ApiStatus.BAD_REQUEST, 'Invalid credentials', HttpCodes.BAD_REQUEST, login.name);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new CWISplitAppException(ApiStatus.BAD_REQUEST, 'Invalid credentials', HttpCodes.BAD_REQUEST, login.name);
  }

  const accessToken = jwt.sign({ email }, accessSecretKey, accessJwtOptions);
  const refreshToken = jwt.sign({ email }, refreshSecretKey, refreshJwtOptions);

  await SessionModel.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        isLoggedIn: true,
        deviceModel,
        deviceOs,
        deviceType,
        ipAddress,
        userAgent,
        refreshToken,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + getRefreshTokenExpiryInMs()),
      },
      $setOnInsert: {
        createdAt: new Date(),
        userId: user._id,
      },
    },
    { upsert: true, runValidators: true }
  );

  return {
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email, photoUri: user.photoUri, isEmailVerified: user.isEmailVerified },
    },
  };
}

export async function logout(userId: string): Promise<IServiceResponse<null>> {
  await SessionModel.findOneAndUpdate(
    { userId },
    { $set: { isLoggedIn: false, refreshToken: null, updatedAt: new Date() } }
  );

  return {
    success: true,
    data: null,
  };
}

export async function getMe(accessToken: string): Promise<IServiceResponse<Record<string, any>>> {
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const jwtManager = JwtManager.getInstance();
  const decodedPayload = jwtManager.decodeToken(accessToken, jwtManager.accessSecretKey);

  if (!decodedPayload || typeof decodedPayload === 'string' || !decodedPayload.email) {
    throw new CWISplitAppException(ApiStatus.UNAUTHORIZED, 'Invalid identity', HttpCodes.UNAUTHORIZED, getMe.name);
  }

  const user = await UserModel.findOne({ email: decodedPayload.email, isBlocked: false, isDeleted: false });

  if (!user) {
    throw new CWISplitAppException(ApiStatus.UNAUTHORIZED, 'Invalid identity', HttpCodes.UNAUTHORIZED, getMe.name);
  }

  return { success: true, data: { name: user.name, email: user.email } };
}

export async function generateNewAccessToken(refreshToken: string): Promise<IServiceResponse<Record<string, any>>> {
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const jwtManager = JwtManager.getInstance();
  const logger = LoggerManager.getInstance();

  const decodedPayload = jwtManager.decodeToken(refreshToken, jwtManager.refreshSecretKey);

  if (!decodedPayload || typeof decodedPayload === 'string' || !decodedPayload.email) {
    logger.error('Failed to decode refresh token or token does not contain email.');

    throw new CWISplitAppException(
      ApiStatus.UNAUTHORIZED,
      'Invalid identity',
      HttpCodes.UNAUTHORIZED,
      generateNewAccessToken.name
    );
  }

  const email = decodedPayload.email;
  const user = await UserModel.findOne({ email, isBlocked: false, isDeleted: false });

  if (!user) {
    logger.error('User not found or is blocked/deleted.');

    throw new CWISplitAppException(
      ApiStatus.UNAUTHORIZED,
      'Invalid identity',
      HttpCodes.UNAUTHORIZED,
      generateNewAccessToken.name
    );
  }

  const accessToken = jwt.sign({ email }, jwtManager.accessSecretKey, {
    algorithm: jwtManager.algorithm,
    issuer: jwtManager.issuer,
    expiresIn: jwtManager.accessTokenExpiry as any,
  });

  return {
    success: true,
    data: { accessToken },
  };
}
