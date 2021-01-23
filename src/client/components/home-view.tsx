import { Component, VNode } from 'preact';
import { RoutableProps } from 'preact-router';

import { Last24Hours } from './last-24-hours';

interface HomeViewProps extends RoutableProps {}

export class HomeView extends Component<HomeViewProps> {
  public render(): VNode {
    return (
      <div class="c-home-view">
        <Last24Hours />
      </div>
    );
  }
}
