/* eslint-disable no-console,@typescript-eslint/no-explicit-any */

export const logger = {
  log: (...msg: any[]): void => {
    console.log(...msg);
  },
  error: (...msg: any[]): void => {
    console.error(...msg);
  }
};
