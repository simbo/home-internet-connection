import { Component, Fragment, VNode } from 'preact';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StatusValue } from '../../shared/status-value.enum';
import { currentStatus$ } from '../lib/current-status';
import { formatBps, formatDate, formatKey, formatPing, formatSince, formatStatus } from '../lib/format';
import { latestSpeed$ } from '../lib/latest-speed';
import { Speed } from '../lib/speed.interface';
import { CurrentStatus } from '../lib/status.interface';

interface StatusBarState {
  status: CurrentStatus;
  speed: Speed;
}

export class StatusBar extends Component<{}, StatusBarState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor(props: {}) {
    super(props);
    currentStatus$.pipe(takeUntil(this.unsubscribeSubject)).subscribe(status => {
      this.setState(state => ({ ...state, status }));
    });
    latestSpeed$.pipe(takeUntil(this.unsubscribeSubject)).subscribe(speed => {
      this.setState(state => ({ ...state, speed }));
    });
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: {}, { status, speed }: StatusBarState): VNode {
    return (
      <div
        className={
          status
            ? `c-status-bar c-status-bar--${formatKey(formatStatus(status.status))}`
            : 'c-status-bar c-status-bar--unknown'
        }
      >
        <div className="c-status-bar__content">
          <div class="c-status-bar__status">
            <div class="c-status-bar__status-text">
              Status: <strong>{status ? formatStatus(status.status) : formatStatus(StatusValue.Unknown)}</strong>
            </div>
            {status && status.from ? (
              <div class="c-status-bar__status-details">
                <span title={formatDate(status.from)}>since {formatSince(status.from)}</span>
                {status.to ? (
                  <Fragment>
                    , <span title={formatDate(status.to)}>updated {formatSince(status.to)} ago</span>
                  </Fragment>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          <div class="c-status-bar__speed">
            <div class="c-status-bar__speed-text">
              Download: <strong>{speed ? `${formatBps(speed.down)}` : 'N/A'}</strong>
            </div>
            {speed ? (
              <div class="c-status-bar__speed-details">
                Upload: {formatBps(speed.up)}, Ping: {formatPing(speed.ping)},{' '}
                <span title={formatDate(speed.date)}>tested {formatSince(speed.date)} ago</span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}
