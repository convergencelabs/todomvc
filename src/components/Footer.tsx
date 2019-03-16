import React, {Component, ReactNode} from "react";

export class Footer extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <footer className="info">
        <p>Double-click to edit a todo. Drag to reorder them.</p>
        <p>Created by <a href="http://github.com/convergencelabs/">Convergence Labs, Inc.</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    );
  }
}