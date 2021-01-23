import { StatusValue } from '../../shared/status-value.enum';
import { MinutewiseStatus, StatusPercentages } from './status.interface';

export function getStatusPercentages(collection: MinutewiseStatus[]): StatusPercentages {
  return collection
    .reduce(
      (byStatus, entry) => {
        byStatus[entry.status]++;
        return byStatus;
      },
      [0, 0, 0, 0]
    )
    .reduce(
      (percentages, count, i) => {
        percentages[i as StatusValue] = (count / collection.length) * 100;
        return percentages;
      },
      {
        [StatusValue.Offline]: 0,
        [StatusValue.NetworkReachable]: 0,
        [StatusValue.InternetReachable]: 0,
        [StatusValue.Unknown]: 0
      }
    );
}
