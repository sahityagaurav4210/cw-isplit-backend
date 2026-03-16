import { AppEventsManager, RedisManager, RequestManager } from './config';
import app from './config/app.config';
import { FileHelper } from './helpers/files.helpers';

export async function runServer() {
  const PORT: number = Number(process.env.PORT) || 3030;
  const HOST: string = process.env.HOST || '0.0.0.0';

  await RedisManager.initialize();
  AppEventsManager.initialize();
  await RequestManager.initialize();

  app.listen(PORT, HOST);
  const bannerPath = FileHelper.getAbsolutePath('./banner.txt');
  const bannerContent = (await FileHelper.readFile(bannerPath)).toString();

  console.log(bannerContent);
  console.log('iSplit Backend service started successfully 🚀🚀🚀🚀');
}
