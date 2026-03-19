import {
  AppEventsManager,
  AppManager,
  DatabaseManager,
  LoggerManager,
  RedisManager,
  RequestManager,
  UploadsManager,
} from './config';
import { FileHelper } from './helpers/files.helpers';

export async function runServer() {
  const PORT: number = Number(process.env.PORT) || 3030;
  const HOST: string = process.env.HOST || '0.0.0.0';

  await AppManager.initialize();
  LoggerManager.initialize();
  await DatabaseManager.initialize();
  await UploadsManager.initialize();

  const app = await AppManager.getInstance();

  await RedisManager.initialize();
  AppEventsManager.initialize();
  await RequestManager.initialize();

  app.listen(PORT, HOST);
  const bannerPath = FileHelper.getAbsolutePath('./banner.txt');
  const bannerContent = (await FileHelper.readFile(bannerPath)).toString();
  const text = `iSplit Backend service (${AppManager.getAppPid()}) started successfully and is consuming ${AppManager.getAppMemoryUsage()} MB of memory 🚀🚀🚀🚀`;

  console.log(bannerContent);
  console.log(text);
}
