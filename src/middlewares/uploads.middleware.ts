import type { NextFunction, Request, Response } from 'express';
import { UploadsManager } from '../config';

export const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const uploadManager = await UploadsManager.getInstance();
  return uploadManager.single('photo')(req, res, next);
};
