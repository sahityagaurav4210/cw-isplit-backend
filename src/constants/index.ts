import { ApiStatus, HttpCodes } from './api.constants';
import { AppLoggerColors, AppLoggerLevels } from './logger.constants';

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
}

export default AppConstants;
