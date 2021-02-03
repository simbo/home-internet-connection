const {
  NODE_ENV,
  SPEEDTEST_VALUE_MULTIPLIER,
  SPEEDTEST_EXPECTED_DOWN,
  SPEEDTEST_EXPECTED_UP,
  SPEEDTEST_EXPECTED_PING,
  DATE_FULL,
  DATE_SHORT,
  TIME_FULL,
  TIME_SHORT,
  APP_NAME,
  APP_SHORT_NAME,
  APP_LONG_NAME,
  APP_VERSION
} = process.env as { [key: string]: string };

/* eslint-disable @typescript-eslint/naming-convention */
const envVars = {
  NODE_ENV,
  SPEEDTEST_VALUE_MULTIPLIER,
  SPEEDTEST_EXPECTED_DOWN,
  SPEEDTEST_EXPECTED_UP,
  SPEEDTEST_EXPECTED_PING,
  DATE_FULL,
  DATE_SHORT,
  TIME_FULL,
  TIME_SHORT,
  APP_NAME,
  APP_SHORT_NAME,
  APP_LONG_NAME,
  APP_VERSION
};

const undefinedEnvVars = Object.entries(envVars)
  .filter(([key, value]) => value === undefined)
  .map(([key]) => key);

if (undefinedEnvVars.length) {
  throw new Error(
    `Undefined ENV variable${undefinedEnvVars.length > 1 ? 's' : ''}: "${undefinedEnvVars.join('", "')}"`
  );
}

export const env = {
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV !== 'production',
  speedtest: {
    valueMultiplier: parseInt(SPEEDTEST_VALUE_MULTIPLIER, 10),
    expected: {
      down: parseInt(SPEEDTEST_EXPECTED_DOWN, 10),
      up: parseInt(SPEEDTEST_EXPECTED_UP, 10),
      ping: parseInt(SPEEDTEST_EXPECTED_PING, 10)
    }
  },
  date: {
    full: DATE_FULL,
    short: DATE_SHORT
  },
  time: {
    full: TIME_FULL,
    short: TIME_SHORT
  },
  app: {
    name: APP_NAME,
    shortName: APP_SHORT_NAME,
    longName: APP_LONG_NAME,
    version: APP_VERSION
  }
};
