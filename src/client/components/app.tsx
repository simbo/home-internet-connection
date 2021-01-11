import { createHashHistory } from 'history';
import { Component, VNode } from 'preact';
import Router from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';
import { HomeView } from './home-view';

export class App extends Component {
  constructor() {
    super();
  }

  public render(): VNode {
    return (
      <div class="c-app">
        <Router history={createHashHistory()}>
          <HomeView path={AppRoute.Home} />
        </Router>
      </div>
    );
  }
}
