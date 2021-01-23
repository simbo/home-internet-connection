import { createHashHistory } from 'history';
import { Component, VNode } from 'preact';
import Router from 'preact-router';
import { from, Subject, timer } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { apiService } from '../lib/api.service';
import { AppRoute } from '../lib/app-route.enum';
import { Speed } from '../lib/speed.interface';
import { LatestStatus } from '../lib/status.interface';
import { StoreAction } from '../store/actions';
import { store } from '../store/store';
import { HomeView } from './home-view';
import { StatusBar } from './status-bar';

export class App extends Component {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    this.requestStatusInterval();
    this.requestSpeedInterval();
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(): VNode {
    return (
      <div class="c-app">
        <StatusBar />
        <Router history={createHashHistory()}>
          <HomeView path={AppRoute.Home} />
        </Router>
      </div>
    );
  }

  private requestStatusInterval(): void {
    this.requestInterval<LatestStatus>(apiService.getLatestStatus.bind(apiService), StoreAction.SetLatestStatus);
  }

  private requestSpeedInterval(): void {
    this.requestInterval<Speed>(apiService.getLatestSpeed.bind(apiService), StoreAction.SetLatestSpeed);
  }

  private requestInterval<T>(fn: () => Promise<T>, action: StoreAction): void {
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        mergeMap(() => from(fn()))
      )
      .subscribe(
        response => {
          store.dispatch(action, response);
        },
        () => {
          return;
        }
      );
  }
}
