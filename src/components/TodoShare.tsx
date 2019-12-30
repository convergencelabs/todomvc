import React, {Component, ReactNode} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {ToastsStore} from 'react-toasts';

export class TodoShare extends Component<{}, {}> {

  public render(): ReactNode {
    return (
      <div className="share">
        <CopyToClipboard 
          text={window.location.href} 
          onCopy={() => ToastsStore.success("URL Copied")}
        >
          <span className="anchor" style={{color: "#3d4161"}}>
            Share <i className="far fa-share-square"/>
          </span>
        </CopyToClipboard>
        <span className="anchor" style={{color: "#3d4161"}} onClick={this._newWindowWithTodo}>
          New Window <i className="fas fa-external-link-alt"/>
        </span>
      </div>
    );
  }

  private _newWindowWithTodo = () => {
    window.open(window.location.href, "_blank");
  }
}