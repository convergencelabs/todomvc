import {action, decorate, observable} from "mobx";
import {
  RealTimeObject,
  RealTimeString,
  RealTimeBoolean,
  IConvergenceEvent,
  StringSetValueEvent,
  BooleanSetValueEvent,
} from "@convergence/convergence";

export class Todo {
  public readonly id: string;
  public title: string;
  public completed: boolean;

  private readonly _todo: RealTimeObject;
  private readonly _title: RealTimeString;
  private readonly _completed: RealTimeBoolean;
  private _remote: boolean;

  constructor(model: RealTimeObject) {
    this._todo = model;

    this._remote = false;

    this._title = this._todo.get("title") as RealTimeString;
    this.title = this._title.value();
    this._title.on(RealTimeString.Events.VALUE, (e: IConvergenceEvent) => {
      this._remote = true;
      this.setTitle((e as StringSetValueEvent).element.value());
      this._remote = false;
    });

    this._completed = this._todo.get("completed") as RealTimeBoolean;
    this.completed = this._completed.value();
    this._completed.on(RealTimeBoolean.Events.VALUE, (e: IConvergenceEvent) => {
      this._remote = true;
      this.setCompleted((e as BooleanSetValueEvent).element.value());
      this._remote = false;
    });

    this.id = (this._todo.get("id") as RealTimeString).value();
  }

  public setCompleted(completed: boolean): void {
    this.completed = completed;

    if (!this._remote) {
      this._completed.value(completed);
    }
  }

  public setTitle(title: string): void {
    this.title = title;

    if (!this._remote) {
      this._title.value(title);
    }
  }
}

decorate(Todo, {
  title: observable,
  completed: observable,
  setCompleted: action,
  setTitle: action
});