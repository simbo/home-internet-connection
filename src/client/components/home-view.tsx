import { Component, VNode } from 'preact';
import { RoutableProps } from 'preact-router';

interface HomeViewProps extends RoutableProps {}

export class HomeView extends Component<HomeViewProps> {
  public render(): VNode {
    return (
      <div class="c-home-view">
        <h1>Hello World</h1>
      </div>
    );
  }
}
