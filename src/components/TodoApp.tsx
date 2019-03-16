import React, {Component, ReactNode} from 'react';
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from "../constants";
import {TodoStore} from "../stores/TodoStore";
import {observer} from "mobx-react";
import {TodoHeader} from "./TodoHeader";
import {TodoMain} from "./TodoMain";
import {TodoFooter} from "./TodoFooter";
import {Footer} from "./Footer";
import * as director from "director/build/director";

interface ITodoAppProps {
  todoStore: TodoStore;
}

interface ITodoAppState {
  filter?: string;
}

class TodoAppComponent extends Component<ITodoAppProps, ITodoAppState> {

  constructor(props: ITodoAppProps) {
    super(props);
    this.state = {
      filter: ALL_TODOS
    };
  }

  public componentDidMount(): void {
    const router = new director.Router({
      '/': () => this.setState({filter: ALL_TODOS}),
      '/active': () => this.setState({filter: ACTIVE_TODOS}),
      '/completed': () => this.setState({filter: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public render(): ReactNode {

    const activeTodoCount = this.props.todoStore.activeTodoCount;
    const completedCount = this.props.todoStore.completeTodoCount;

    const footer = activeTodoCount || completedCount ?
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        filter={this.state.filter}
        onClearCompleted={() => this._deleteCompleted()}
      /> :
      null;


    const main = this.props.todoStore.todos.length ?
      <TodoMain
        todoStore={this.props.todoStore}
        filter={this.state.filter}
      /> :
      null;

    return (
      <div>
        <section className="todoapp">
          <TodoHeader todoStore={this.props.todoStore}/>
          {main}
          {footer}
        </section>
        <Footer/>
      </div>
    );
  }

  private _deleteCompleted() {
    this.props.todoStore.deleteCompletedTodos();
  }
}

export const TodoApp = observer(TodoAppComponent);
