import React, {Component, ReactNode} from "react";
import {TodoStore} from "../stores/TodoStore";
import {ConvergenceDomainStore} from "../stores/ConvergenceDomainStore";
import {TodoApp} from "../components/TodoApp";
import {observer} from "mobx-react";

export interface IRootContainerState {
  todoStore: TodoStore | null;
}

export class RootContainer extends Component<{}, IRootContainerState> {

  private readonly _convergenceDomainStore = new ConvergenceDomainStore();

  state = {
    todoStore: null
  };

  public componentDidMount(): void {
    this._convergenceDomainStore
      .connect(CONVERGENCE_URL)
      .then(() => {
        return this._convergenceDomainStore.domain!.models().openAutoCreate({
          collection: "todo",
          id: "demo-todos",
          data: {
            todos: []
          }
        });
      }).then(model => {
        this.setState({todoStore: new TodoStore(model)});
      }
    );
  }

  public componentWillUnmount(): void {
    this._convergenceDomainStore.disconnect();
  }

  public render(): ReactNode {
    const {todoStore} = this.state;
    if (todoStore !== null) {
      return (<TodoApp todoStore={todoStore}/>);
    } else {
      return <div>Loading</div>;
    }
  }
}

export const Root = observer(RootContainer);