# Convergence TodoMVC Demonstration App
This project implements the ubiquitous [TodoMVC](http://todomvc.com/) application in React. It uses [MobX](http://mobx.js.org) for the internal state store, and leverages [Convergence](https://convergence.io) to provide the storage backend and to facilitate realtime management of todos.  For good measure, this version of the application also supports dragging and dropping the todos to reorder them.
 

## Configuration and Launching

1. Ensure you have access to a running Convergence server.  If you don't, the easiest thing to do is grab the Convergence Development Edition docker container.
2. Update the `CONVERGENCE_URL` in the `public/config.js` file to point to you Convergence server.
3. Run `npm start` as described below.


## Available Scripts
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
