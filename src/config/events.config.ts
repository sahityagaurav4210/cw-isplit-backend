import RedisManager from './redis.config';
import RequestManager from './request.config';

class AppEventsManager {
  public static initialize(): void {
    process.on('SIGINT', async function () {
      const appRedisInstance = await RedisManager.getInstance();

      await appRedisInstance.set('cw-isplit:req-id', RequestManager.getCurrentReqId());
      await RedisManager.closeInstance();

      process.exit(0);
    });

    process.on('SIGTERM', async function () {
      const appRedisInstance = await RedisManager.getInstance();

      await appRedisInstance.set('cw-isplit:req-id', RequestManager.getCurrentReqId());
      await RedisManager.closeInstance();

      process.exit(0);
    });

    process.on('uncaughtException', async function (error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
      console.log('Uncaught Exception', error.message, origin);
      process.exit(1);
    });
  }
}

export default AppEventsManager;
