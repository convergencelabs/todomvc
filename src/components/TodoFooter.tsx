import React, {Component, ReactNode} from "react";
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from "../constants";
import pluralize from "pluralize";
import classNames from "classnames";

export interface ITodoFooterProps {
  completedCount: number;
  onClearCompleted: () => void;
  filter: string | undefined;
  count: number;
}

export class TodoFooter extends Component<ITodoFooterProps, {}> {

  public render(): ReactNode {
    const clearButton = this.props.completedCount > 0 ?
      <button
        className="clear-completed"
        onClick={this.props.onClearCompleted}>
        Clear completed
      </button>
      : null;

    const {filter} = this.props;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {pluralize('item', this.props.count)} left
        </span>
        <ul className="filters">
          <li><a href="#/" className={classNames({selected: filter === ALL_TODOS})}>All</a></li>
          <li><a href="#/active" className={classNames({selected: filter === ACTIVE_TODOS})}>Active</a></li>
          <li><a href="#/completed" className={classNames({selected: filter === COMPLETED_TODOS})}>Completed</a></li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}
