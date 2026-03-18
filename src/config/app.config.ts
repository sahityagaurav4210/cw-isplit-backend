import express, { type Application } from 'express';
import {
  appGlobalErrHandlerMiddleware,
  appLoggerMiddleware,
  appReqIdHandlerMiddleware,
} from '../middlewares/app.middleware';
import router from '../routes/index';
import { FileHelper } from '../helpers';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

class AppManager {
  private static instance: Application;

  private constructor() {}

  public static async initialize(): Promise<void> {
    if (!AppManager.instance) {
      const apiDocsPath = FileHelper.getAbsolutePath('./src/docs/index.yaml');
      const apiDocs = YAML.load(apiDocsPath);

      AppManager.instance = express();
      AppManager.instance.use(express.json({ limit: '5kb' }));
      AppManager.instance.use(express.urlencoded({ extended: true, limit: '5kb' }));
      AppManager.instance.set('trust proxy', true);

      AppManager.instance.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

      AppManager.instance.use('/api/v1', appReqIdHandlerMiddleware);
      AppManager.instance.use(appLoggerMiddleware);
      AppManager.instance.use('/api/v1', router);

      AppManager.instance.use(appGlobalErrHandlerMiddleware);
    }
  }

  public static async getInstance(): Promise<Application> {
    if (!AppManager.instance) {
      await AppManager.initialize();
    }
    return AppManager.instance;
  }

  public static getAppPid(): number {
    return process.pid;
  }

  public static getAppVersion(): string {
    return process.env.APP_VERSION || '0.0.1';
  }

  public static getAppPort(): number {
    return Number(process.env.PORT) || 3030;
  }

  public static getAppMemoryUsage(): number {
    return Math.floor(process.memoryUsage().rss / (1024 * 1024));
  }

  public static getAppUptime(): number {
    return Math.floor(process.uptime());
  }

  public static getAppTimestamp(): string {
    return new Date().toISOString();
  }
}

export default AppManager;
