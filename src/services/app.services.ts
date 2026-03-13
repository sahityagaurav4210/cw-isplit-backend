export function pingService(): string {
  return "Pong";
}

export function appHealthService(): Record<string, any> {
  const pid = process.pid;
  const memoryUsage = Math.floor(process.memoryUsage().rss / (1024 * 1024));
  const uptime = Math.floor(process.uptime());

  return {
    pid,
    memoryUsage,
    uptime,
    timestamp: new Date().toISOString(),
  };
}
