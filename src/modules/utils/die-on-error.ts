import { logger } from '../logger/logger';

export function dieOnError(err: Error): void {
  logger.error(err);
  process.exit(1);
}
