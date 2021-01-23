import { StatusValue } from '../../shared/status-value.enum';

export function sortStatus(selector: (v: any) => StatusValue = v => v): (a: any, b: any) => number {
  return (a: any, b: any) => {
    if (selector(a) === StatusValue.InternetReachable) {
      return -1;
    } else if (selector(b) === StatusValue.InternetReachable) {
      return 1;
    } else {
      return selector(a) < selector(b) ? -1 : 1;
    }
  };
}
