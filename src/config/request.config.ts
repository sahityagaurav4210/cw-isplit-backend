import RedisManager from './redis.config';

class RequestManager {
  private static reqId: number = 0;

  private constructor() {}

  public static async initialize(): Promise<void> {
    const appRedisInstance = await RedisManager.getInstance();
    const requestId = await appRedisInstance.get('cw-isplit:req-id');

    if (requestId) {
      RequestManager.reqId = Number.parseInt(requestId, 10);
    }
  }

  public static getNextReqId(): string {
    RequestManager.reqId++;
    return `cw-isplit-req-${RequestManager.reqId.toString().padStart(10, '0')}`;
  }

  public static getCurrentReqId(): string {
    return RequestManager.reqId.toString();
  }
}

export default RequestManager;
