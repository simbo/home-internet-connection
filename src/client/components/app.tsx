import { createHashHistory } from 'history';
import { Component, VNode } from 'preact';
import Router from 'preact-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { currentStatus$ } from '../lib/current-status';
import { env } from '../lib/env';
import { formatStatus } from '../lib/format';
import { HomeView } from './home-view';
import { StatusBar } from './status-bar';

export class App extends Component {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    currentStatus$.pipe(takeUntil(this.unsubscribeSubject)).subscribe(status => {
      document.title = `${formatStatus(status.status)} | ${env.app.longName}`;
    });
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
}
