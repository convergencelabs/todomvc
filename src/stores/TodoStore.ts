import {action, computed, decorate, observable} from "mobx";
import {
  RealTimeModel,
  RealTimeArray,
  RealTimeObject,
  RealTimeElement,
  ArrayInsertEvent,
  ArrayRemoveEvent,
  ArrayReorderEvent
} from "@convergence/convergence";
import {Todo} from "../models/Todo";
import randomstring from "randomstring";

export class TodoStore {

  public todos: Todo[];
  private readonly _model: RealTimeModel;
  private readonly _rtTodos: RealTimeArray;

  constructor(realtimeModel: RealTimeModel) {
    this._model = realtimeModel;
    this._rtTodos = this._model.elementAt("todos") as RealTimeArray;

    this.todos = [];

    this._rtTodos.forEach((todo: RealTimeElement<any>) => {
      this.todos.push(new Todo(todo as RealTimeObject));
    });

    this._rtTodos.on(RealTimeArray.Events.INSERT, e => {
      const todo = new Todo((e as ArrayInsertEvent).value as RealTimeObject);
      action(() => {
        this.todos.push(todo);
      })();
    });

    this._rtTodos.on(RealTimeArray.Events.REMOVE, e => {
      const todoId = (e as ArrayRemoveEvent).oldValue.value().id;
      action(() => {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
      })();
    });

    this._rtTodos.on(RealTimeArray.Events.REORDER, e => {
      const fromIndex = (e as ArrayReorderEvent).fromIndex;
      const toIndex = (e as ArrayReorderEvent).toIndex;
      action(() => {
        this._move(fromIndex, toIndex);
      })();
    });
  }

  public addTodo(title: string) {
    const id = randomstring.generate(32);

    const todoModel = this._rtTodos.push({
      id:  id,
      title: title,
      completed: false,
    }) as RealTimeObject;

    const newTodo = new Todo(todoModel);
    this.todos.push(newTodo);
  }

  public deleteTodo(todo: Todo) {
    const index = this.todos.findIndex(function (candidate) {
      return candidate === todo;
    });

    this.todos.splice(index, 1);
    this._rtTodos.remove(index);
  }

  public deleteCompletedTodos() {
    let index = this.todos.findIndex(todo => todo.completed);
    // TODO somewhat inefficient. We could keep a cursor and more smartly move through
    // the array. But for low numbers of todos, this is trivial.
    while (index >= 0) {
      this.todos.splice(index,1);
      this._rtTodos.remove(index);
      index = this.todos.findIndex(todo => todo.completed);
    }
  }

  public setAllTodosCompleted(completed: boolean) {
    this.todos.forEach((todo: Todo) => {
      todo.setCompleted(completed);
    });
  }

  public moveTodo(from: number, to: number) {
    this._move(from, to);
    this._rtTodos.reorder(from, to);
  };

  get activeTodoCount(): number {
    return this.todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);
  }

  get completeTodoCount(): number {
    return this.todos.reduce(function (accum, todo) {
      return todo.completed ? accum + 1 : accum;
    }, 0);
  }

  private _move(from: number, to: number): void {
    const result = Array.from(this.todos);
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    this.todos = result;
  }
}

decorate(TodoStore, {
  todos: observable,

  addTodo: action,
  deleteTodo: action,
  deleteCompletedTodos: action,
  setAllTodosCompleted: action,
  moveTodo: action,

  completeTodoCount: computed,
  activeTodoCount: computed
});

