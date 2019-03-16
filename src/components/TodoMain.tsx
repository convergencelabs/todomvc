import React, {Component, ReactNode} from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {TodoItem} from "./TodoItem";
import {ACTIVE_TODOS, COMPLETED_TODOS} from "../constants";
import {TodoStore} from "../stores/TodoStore";
import {Todo} from "../models/Todo";
import {observer} from "mobx-react";

interface ITodoMainProps {
  todoStore: TodoStore;
  filter?: string;
}

interface ITodoMainState {
  activeTodoId?: string | null;
}

class TodoMainComponent extends Component<ITodoMainProps, ITodoMainState> {

  state = {
    activeTodoId: null
  };

  public render(): ReactNode {
    const todos = this.props.todoStore.todos.filter((todo) => {
      switch (this.props.filter) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    const todoItems = todos.map((todo, index) => {
      return (
        <Draggable key={todo.id} draggableId={todo.id} index={index}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}
                 style={this.getItemStyle(
                   snapshot.isDragging,
                   provided.draggableProps.style
                 )}
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={this._deleteTodo.bind(this, todo)}
                onEdit={this._editTodo.bind(this, todo)}
                editing={this.state.activeTodoId === todo.id}
                onDone={() => this._doneEditing()}
              />
            </div>
          )}
        </Draggable>
      );
    });


    if (this.props.todoStore.todos.length) {
      return (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={e => this._toggleAll(e)}
            checked={this.props.todoStore.activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <DragDropContext onDragEnd={this._onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <ul {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="todo-list">
                  {todoItems}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      );
    } else {
      return null;
    }
  }

  getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "#FAFAFA" : "inherit",

    // styles we need to apply on draggables
    ...draggableStyle
  });

  private _toggleAll(event: React.FormEvent) {
    const target: any = event.target;
    const checked = target.checked;
    this.props.todoStore.setAllTodosCompleted(checked);
  }

  private _deleteTodo(todo: Todo) {
    this.props.todoStore.deleteTodo(todo);
  }

  private _editTodo(todo: Todo) {
    this.setState({activeTodoId: todo.id});
  }

  private _doneEditing() {
    this.setState({activeTodoId: null});
  }

  private _onDragEnd = (result: DropResult) => {
    if (result.destination) {
      const from = result.source.index;
      const to = result.destination.index;
      this.props.todoStore.moveTodo(from, to);
    }
  }
}

export const TodoMain = observer(TodoMainComponent);
