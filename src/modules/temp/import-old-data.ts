import { Status } from '../database/status/status.schema';
import { StatusEntry, StatusValue } from '../database/status/status.types';

const data: StatusEntry[] = [
  {
    status: StatusValue.InternetReachable,
    from: new Date('2021-01-13T02:55:05.488Z'),
    to: new Date()
  },
  {
    status: StatusValue.Offline,
    from: new Date('2021-01-13T02:40:14.007Z'),
    to: new Date('2021-01-13T02:55:05.488Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2021-01-12T08:43:04.668Z'),
    to: new Date('2021-01-13T02:40:14.007Z')
  },
  {
    status: StatusValue.Offline,
    from: new Date('2021-01-11T23:54:14.287Z'),
    to: new Date('2021-01-12T08:43:04.668Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2020-12-23T09:26:05.452Z'),
    to: new Date('2021-01-11T23:54:14.287Z')
  },
  {
    status: StatusValue.Offline,
    from: new Date('2020-12-23T09:25:04.639Z'),
    to: new Date('2020-12-23T09:26:05.452Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2020-12-19T13:16:05.129Z'),
    to: new Date('2020-12-23T09:25:04.639Z')
  },
  {
    status: StatusValue.Offline,
    from: new Date('2020-12-19T13:15:14.507Z'),
    to: new Date('2020-12-19T13:16:05.129Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2020-12-06T12:07:30.969Z'),
    to: new Date('2020-12-19T13:15:14.507Z')
  },
  {
    status: StatusValue.Offline,
    from: new Date('2020-12-06T11:23:08.708Z'),
    to: new Date('2020-12-06T12:07:30.969Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2020-12-04T01:30:05.327Z'),
    to: new Date('2020-12-06T11:23:08.708Z')
  },
  {
    status: StatusValue.Offline,
    from: new Date('2020-12-04T01:29:14.176Z'),
    to: new Date('2020-12-04T01:30:05.327Z')
  },
  {
    status: StatusValue.InternetReachable,
    from: new Date('2020-11-30T22:59:49.175Z'),
    to: new Date('2020-12-04T01:29:14.176Z')
  }
].reverse();

export async function importOldData(): Promise<void> {
  if (await Status.findLatestStatus()) {
    return;
  }
  for (const d of data) {
    const entry = new Status(d);
    await entry.save();
  }
}
