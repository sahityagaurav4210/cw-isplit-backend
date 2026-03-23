import type { Secret } from 'jsonwebtoken';
import type { IJwtConfig } from '../interfaces';
import jwt from 'jsonwebtoken';

class JwtManager {
  private static instance: IJwtConfig;

  private constructor() {}

  public static initialize(): void {
    JwtManager.instance = {
      accessSecretKey: (process.env.JWT_ACCESS_SECRET_KEY || 'cw-isplit-access-secret-key') as Secret,
      refreshSecretKey: (process.env.JWT_REFRESH_SECRET_KEY || 'cw-isplit-refresh-secret-key') as Secret,
      accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '5m',
      refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
      algorithm: 'HS512',
      issuer: 'cw-isplit-backend',
      getRefreshTokenExpiryInMs: function (): number {
        const expiry = JwtManager.instance.refreshTokenExpiry;
        const timeValue = Number(expiry.at(0));

        return 1000 * 60 * 60 * 24 * timeValue;
      },
      verifyToken: function (token: string, secretKey: Secret): boolean {
        const result = jwt.verify(token, secretKey, { algorithms: [this.algorithm as jwt.Algorithm], issuer: this.issuer });
        return !!result;
      },
      decodeToken: function (token: string, secretKey: Secret): Record<string, any> | null {
        const decoded = jwt.verify(token, secretKey, { algorithms: [this.algorithm as jwt.Algorithm], issuer: this.issuer });
        return typeof decoded === 'object' ? decoded : null;
      },
    };
  }

  public static getInstance(): IJwtConfig {
    if (!JwtManager.instance) {
      JwtManager.initialize();
    }

    return JwtManager.instance;
  }
}

export default JwtManager;
