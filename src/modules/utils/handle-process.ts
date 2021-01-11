import { dieOnError } from './die-on-error';

export function handleProcess(): void {
  process.on('uncaughtException', dieOnError);
  process.on('unhandledRejection', dieOnError);
}
