import React, {Component, ReactNode} from "react";
import {TodoStore} from "../stores/TodoStore";
import {ConvergenceDomainStore} from "../stores/ConvergenceDomainStore";
import {TodoApp} from "../components/TodoApp";
import {observer} from "mobx-react";
import * as director from "director/build/director";

export interface IRootContainerState {
  id: string | null;
  todoStore: TodoStore | null;
}

export class RootContainer extends Component<{}, IRootContainerState> {
  private static _createUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  private readonly _convergenceDomainStore = new ConvergenceDomainStore();

  state = {
    todoStore: null,
    id: null
  };

  public componentDidMount(): void {
    console.log("root loading");
    const router = new director.Router({
      "/": () => {
        const id = RootContainer._createUUID();
        const url = new URL(window.location.href);
        window.history.pushState({}, "", url.href  + id);
        this._init(id);
      },
      '/:id': (id: string) => {
        this._init(id);
      }
    });
    router.init('/');
  }

  private _init(id: string): void {
    this._convergenceDomainStore.connect(CONVERGENCE_URL)
      .then(() => {
        return this._convergenceDomainStore.domain!.models().openAutoCreate({
          collection: "todo",
          id,
          data: {
            todos: []
          }
        });
      }).then(model => {
        this.setState({todoStore: new TodoStore(model), id});
      }
    );
  }

  public componentWillUnmount(): void {
    this._convergenceDomainStore.disconnect();
  }

  public render(): ReactNode {
    const {todoStore, id} = this.state;
    if (todoStore !== null && id !== null) {
      return (<TodoApp id={id} todoStore={todoStore}/>);
    } else {
      return <div></div>;
    }
  }
}

export const Root = observer(RootContainer);