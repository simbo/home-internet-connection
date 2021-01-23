import { Component, Fragment, VNode } from 'preact';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { StatusValue } from '../../shared/status-value.enum';
import { formatBps, formatDate, formatKey, formatPing, formatSince, formatStatus } from '../lib/format';
import { Speed } from '../lib/speed.interface';
import { CurrentStatus } from '../lib/status.interface';
import { storeSelectors } from '../store/selectors';
import { store } from '../store/store';

interface StatusBarState {
  status: CurrentStatus | null;
  speed: Speed | null;
}

export class StatusBar extends Component<{}, StatusBarState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor(props: {}) {
    super(props);
    store.state$
      .pipe(
        takeUntil(this.unsubscribeSubject),
        map(storeSelectors.currentStatus),
        filter(status => !!status)
      )
      .subscribe(status => {
        this.setState(state => ({ ...state, status }));
      });
    store.state$
      .pipe(
        takeUntil(this.unsubscribeSubject),
        map(storeSelectors.latestSpeed),
        filter(speed => !!speed)
      )
      .subscribe(speed => {
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
            {status && status.since ? (
              <div class="c-status-bar__status-details">
                <span title={formatDate(status.since)}>since {formatSince(status.since)}</span>
                {status.updated ? (
                  <Fragment>
                    , <span title={formatDate(status.updated)}>updated {formatSince(status.updated)} ago</span>
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
