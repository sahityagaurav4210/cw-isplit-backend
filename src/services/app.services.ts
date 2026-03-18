import { AppManager } from '../config';

export function pingService(): string {
  return 'Pong';
}

export function appHealthService(): Record<string, any> {
  const pid = AppManager.getAppPid();
  const memoryUsage = `${AppManager.getAppMemoryUsage()} MB`;
  const uptime = `${AppManager.getAppUptime()} seconds`;
  const timestamp = AppManager.getAppTimestamp();

  return {
    pid,
    memoryUsage,
    uptime,
    timestamp,
  };
}
