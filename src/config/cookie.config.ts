import type { CookieOptions } from 'express';
import { AppEnvironment } from '../constants';
import type { IAppCookieOptions } from '../interfaces';

class CookieManager {
  private static instance: IAppCookieOptions;

  private constructor() {}

  public static initialize(): void {
    if (!CookieManager.instance) {
      const environment = process.env.NODE_ENV;
      const commonCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: !!(environment === AppEnvironment.PRODUCTION),
        sameSite: 'strict',
      };
      const accessTokenExp = Number(process.env.JWT_ACCESS_COOKIE_EXPIRY) || 5;
      const refreshTokenExp = Number(process.env.JWT_REFRESH_COOKIE_EXPIRY) || 1440;

      CookieManager.instance = {
        accessToken: {
          ...commonCookieOptions,
          signed: true,
          maxAge: 1000 * 60 * accessTokenExp,
        },
        refreshToken: {
          ...commonCookieOptions,
          signed: true,
          maxAge: 1000 * 60 * refreshTokenExp,
        },
      };
    }
  }

  public static getInstance(): IAppCookieOptions {
    if (!CookieManager.instance) {
      CookieManager.initialize();
    }
    return CookieManager.instance;
  }
}

export default CookieManager;
