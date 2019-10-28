import React, {Component, ReactNode, MouseEvent} from 'react';
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from "../constants";
import {TodoStore} from "../stores/TodoStore";
import {observer} from "mobx-react";
import {TodoHeader} from "./TodoHeader";
import {TodoMain} from "./TodoMain";
import {TodoFooter} from "./TodoFooter";
import {Footer} from "./Footer";
import * as director from "director/build/director";

declare const toastr: any;

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
        <div>
          <div className="share">
            <span onClick={this._copyUrlToClipboard}>
              <span>Share</span>
              <i className="far fa-share-square"/>
            </span>
            <span onClick={this._newWindowWithTodo}>
              <span>New Window</span>
              <i className="fas fa-external-link-alt"/>
            </span>
          </div>
        </div>
        <section className="todoapp">
          <TodoHeader todoStore={this.props.todoStore}/>
          {main}
          {footer}
        </section>
        <Footer/>
      </div>
    );
  }

  private _copyUrlToClipboard = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection()!.rangeCount > 0
        ? document.getSelection()!.getRangeAt(0)
        : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection()!.removeAllRanges();
      document.getSelection()!.addRange(selected);
    }

    toastr["success"]("URL Copied");
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "500",
      "timeOut": "2000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
  }

  private _newWindowWithTodo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(window.location.href, "_blank");
  }

  private _deleteCompleted() {
    this.props.todoStore.deleteCompletedTodos();
  }
}

export const TodoApp = observer(TodoAppComponent);
