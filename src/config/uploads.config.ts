import multer, { type Multer } from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { FileHelper } from '../helpers';
import type { Request } from 'express';

class UploadsManager {
  private static instance: Multer;

  private constructor() {}

  public static async initialize(): Promise<void> {
    if (!UploadsManager.instance) {
      const maxAllowedFileSize = Number(process.env.MAX_ALLOWED_FILE_SIZE) || 5;
      await FileHelper.createDirectory(FileHelper.getAbsolutePath('./assets'));

      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, FileHelper.getAbsolutePath('./assets'));
        },

        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + crypto.randomInt(0, 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
      });

      const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
      };

      UploadsManager.instance = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
          fileSize: 1024 * 1024 * maxAllowedFileSize,
        },
      });
    }
  }

  public static async getInstance(): Promise<Multer> {
    if (!UploadsManager.instance) {
      await UploadsManager.initialize();
    }

    return UploadsManager.instance;
  }
}

export default UploadsManager;
