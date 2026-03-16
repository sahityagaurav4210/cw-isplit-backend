import { createClient, type RedisClientType } from 'redis';

class RedisManager {
  private static instance: RedisClientType;

  private constructor() {}

  public static async initialize(): Promise<void> {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD || '';

    if (!redisHost || !redisPort) {
      throw new Error('Redis configuration is incomplete');
    }

    if (!RedisManager.instance) {
      RedisManager.instance = createClient({
        socket: {
          host: redisHost,
          port: Number(redisPort),
        },
        password: redisPassword,
      });

      RedisManager.instance.on('error', (err) => {
        console.error('Redis Client Error', err.message);
        process.exit(1);
      });

      await RedisManager.instance.connect();
    }
  }

  public static async getInstance(): Promise<RedisClientType> {
    if (!RedisManager.instance) {
      await RedisManager.initialize();
    }

    return RedisManager.instance;
  }

  public static async closeInstance(): Promise<void> {
    if (RedisManager.instance) {
      await RedisManager.instance.close();
    }
  }
}

export default RedisManager;
