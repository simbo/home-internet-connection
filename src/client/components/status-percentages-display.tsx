import { Component, VNode } from 'preact';

import { formatPercentage, formatStatus } from '../lib/format';
import { sortStatus } from '../lib/sort-status';
import { StatusPercentages } from '../lib/status.interface';

interface StatusPercentagesDisplayProps {
  percentages: StatusPercentages;
}

export class StatusPercentagesDisplay extends Component<StatusPercentagesDisplayProps> {
  public render({ percentages }: StatusPercentagesDisplayProps): VNode {
    return (
      <div class="c-status-percentages-display">
        {Object.entries(percentages)
          .filter(([status, value]) => value > 0)
          .map(([status, value]) => [parseInt(status, 10), value])
          .sort(sortStatus(([status]) => status))
          .map(([status, value]) => (
            <div class="c-status-percentages-display__percentage">
              <div class="c-status-percentages-display__label">{formatStatus(status)}</div>
              <div class="c-status-percentages-display__value">{formatPercentage(value)}</div>
            </div>
          ))}
      </div>
    );
  }
}
