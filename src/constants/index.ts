import { ApiStatus, HttpCodes } from './api.constants';
import { DBModelsNames } from './db.constants';
import { AppLoggerColors, AppLoggerLevels } from './logger.constants';
import { DeviceModelType, DeviceOsType, DeviceType, PlatformType } from './sessions.constants';
export * from './app.constants';
export * from './regex.constants';
export * from './otp.constants';

namespace AppConstants {
  export function getLoggerConstants() {
    return {
      AppLoggerColors,
      AppLoggerLevels,
    };
  }

  export function getApiConstants() {
    return {
      ApiStatus,
      HttpCodes,
    };
  }

  export function getDbConstants() {
    return {
      DBModelsNames,
    };
  }

  export function getSessionConstants() {
    return {
      PlatformType,
      DeviceType,
      DeviceOsType,
      DeviceModelType,
    };
  }
}

export default AppConstants;
