export function leadingZeros(value: string | number, length = 2): string {
  const num = typeof value === 'number' ? value : parseInt(value, 10);
  return `${num}`.padStart(length, '0');
}
