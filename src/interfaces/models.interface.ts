import type { DBObjectId } from '.';

interface IDbId {
  _id: string;
}

interface IDbTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IDbId, IDbTimestamps {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  photoUri?: string;
}

export interface ISessionModel extends IDbId, IDbTimestamps {
  userId: DBObjectId;
  refreshToken: string;
  expiresAt: Date;
  isLoggedIn: boolean;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  deviceModel?: string;
  deviceOs?: string;
}
