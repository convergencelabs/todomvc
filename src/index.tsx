import React from 'react';
import ReactDOM from 'react-dom';

import {Root} from "./containers/Root";

import "todomvc-common/base.css";
import "todomvc-app-css/index.css";

import { configure } from "mobx";

configure({
  enforceActions: "observed"
});

ReactDOM.render(
  <Root />,
  document.getElementById('todoapp')
);
