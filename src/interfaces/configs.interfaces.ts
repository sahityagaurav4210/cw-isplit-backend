import type { Algorithm, Secret } from 'jsonwebtoken';

export interface IJwtConfig {
  accessSecretKey: Secret;
  refreshSecretKey: Secret;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  algorithm: Algorithm | undefined;
  issuer: string;
  getRefreshTokenExpiryInMs: () => number;
  verifyToken: (token: string, secretKey: Secret) => boolean;
  decodeToken: (token: string, secretKey: Secret) => Record<string, any> | null;
}
