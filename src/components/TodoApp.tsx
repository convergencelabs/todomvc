import React, {Component, ReactNode} from 'react';
import {observer} from "mobx-react";
import * as director from "director/build/director";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from "../constants";
import {TodoStore} from "../stores/TodoStore";
import {TodoHeader} from "./TodoHeader";
import {TodoMain} from "./TodoMain";
import {TodoFooter} from "./TodoFooter";
import {Footer} from "./Footer";
import { TodoShare } from './TodoShare';

interface ITodoAppProps {
  id: string;
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
    // const id = TodoAppComponent._getId();
    // console.log(id);
    const router = new director.Router({
      '/:id': {
        '': (id: string) => this.setState({filter: ALL_TODOS}),
        '/active': (id: string) => this.setState({filter: ACTIVE_TODOS}),
        '/completed': (id: string) => this.setState({filter: COMPLETED_TODOS})
      }
    });
    router.init('/');
  }

  public render(): ReactNode {
    const activeTodoCount = this.props.todoStore.activeTodoCount;
    const completedCount = this.props.todoStore.completeTodoCount;

    const footer = activeTodoCount || completedCount ?
      <TodoFooter
        id={this.props.id}
        count={activeTodoCount}
        completedCount={completedCount}
        filter={this.state.filter}
        onClearCompleted={() => this._deleteCompleted()}
      /> :
      null;

    const main = this.props.todoStore.todos.length ?
      <TodoMain
        id={this.props.id}
        todoStore={this.props.todoStore}
        filter={this.state.filter}
      /> :
      null;

    return (
      <div>
        <ToastsContainer 
          store={ToastsStore} 
          position={ToastsContainerPosition.TOP_RIGHT} 
          lightBackground />
        <TodoShare />
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
