import { AsyncSubject } from "rxjs";

/**
 * Override Config
 */
export const OVERRIDES = (defaultConfig: any, switchConfig: any) => {
  if (switchConfig && Object.keys(switchConfig)?.length) {
    for (const key in defaultConfig) {
      switchConfig = switchConfig?.hasOwnProperty(key)
        ? switchConfig
        : JSON.parse(
          JSON.stringify({
            ...switchConfig,
            ...{ [key]: (defaultConfig as any)[key] },
          })
        );
    }
    return switchConfig;
  } else {
    return defaultConfig;
  }
};

/**
 * Rxjs complete
 * @param as
 * @param data
 * @param error
 */
export const AS_COMPLETE = (as: AsyncSubject<any>, data: any, error = null) => {
  error ? as.error(error) : as.next(data);
  as.complete();
};