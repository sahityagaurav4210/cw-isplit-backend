const AppLoggerLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  HTTP: 3,
  DEBUG: 4,
};

enum AppLoggerColors {
  ERROR = 'red',
  WARN = 'yellow',
  INFO = 'green',
  HTTP = 'magenta',
  DEBUG = 'cyan',
}

export { AppLoggerColors, AppLoggerLevels };
