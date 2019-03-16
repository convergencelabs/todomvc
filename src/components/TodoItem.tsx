import classNames from "classnames";
import React, {Component, ReactNode} from "react";
import {ENTER_KEY, ESCAPE_KEY} from "../constants";
import {Todo} from "../models/Todo";
import {observer} from "mobx-react";

interface ITodoItemProps {
  todo: Todo;
  editing?: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onDone: () => void;
}

interface ITodoItemState {
  editText: string
}

class TodoItemComponent extends Component<ITodoItemProps, ITodoItemState> {

  private _editField: HTMLInputElement | undefined;

  constructor(props: ITodoItemProps) {
    super(props);
    this.state = {editText: this.props.todo.title};
  }

  public componentDidUpdate(prevProps: ITodoItemProps): void {
    if (!prevProps.editing && this.props.editing && this._editField !== undefined) {
      this._editField.focus();
      this._editField.setSelectionRange(0, this._editField.value.length);
    }
  }

  public render(): ReactNode {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this._handleToggle}
          />
          <label onDoubleClick={this._handleEdit}>{this.props.todo.title}</label>
          <button className="destroy" onClick={this.props.onDelete}/>
        </div>
        <input
          ref={this._setEditField}
          className="edit"
          value={this.state.editText}
          onBlur={this._handleSubmit}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          onKeyUp={this._handleKeyUp}
        />
      </li>
    );
  }

  private _handleSubmit = () => {
    const val = this.state.editText.trim();
    if (val) {
      this.props.todo.setTitle(val);
      this.props.onDone();
      this.setState({editText: val});
    } else {
      this.props.onDelete();
    }
  };

  private _handleEdit = () => {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
  };

  private _handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onDone();
    } else if (event.keyCode === ENTER_KEY) {
      this._handleSubmit();
    }
  };

  private _handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onDone();
    } else if (event.keyCode === ENTER_KEY) {
      this._handleSubmit();
    }
  };

  private _handleChange = (event: React.FormEvent) => {
    const input: any = event.target;
    this.setState({editText: input.value});
  };

  private _handleToggle = () => {
    this.props.todo.setCompleted(!this.props.todo.completed);
  };

  private _setEditField = (el: HTMLInputElement) => {
    this._editField = el;
  }
}

export const TodoItem = observer(TodoItemComponent);