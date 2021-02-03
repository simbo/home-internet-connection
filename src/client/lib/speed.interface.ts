export interface Speed {
  date: Date;
  down: number;
  up: number;
  ping: number;
  host: string | null;
  error: string | null;
}
