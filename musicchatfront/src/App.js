import React from 'react';
import './App.css';
import LoginScreen from './LoginScreens/Login.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//root class, all other classes are connected throught this class with react-router
export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div value = "mainDiv">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
          <hr />

          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/">
              <LoginScreen />
            </Route>
            <Route exact path="/login">
              <LoginScreen />
            </Route>
            <Route exact path="/about">
              <LoginScreen />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

