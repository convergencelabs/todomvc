import React, {Component, KeyboardEvent, ReactNode} from 'react';
import {ENTER_KEY} from "../constants";
import {TodoStore} from "../stores/TodoStore";

interface ITodoAppProps {
  todoStore: TodoStore;
}

export class TodoHeader extends Component<ITodoAppProps, {}> {

  public render(): ReactNode {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={this._handleKeyDown}
          autoFocus={true}
        />
      </header>
    );
  }

  private _handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();

      const input = event.currentTarget;
      const val = input.value.trim();

      if (val) {
        this.props.todoStore.addTodo(val);
        input.value = '';
      }
    }
  }
}
