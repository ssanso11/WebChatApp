import React from 'react';
import './App.css';
import LoginScreen from './LoginScreens/Login.js';
import InfoScreen from './HomeScreens/InfoScreen.js';
import PrimaryDashboardScreen from './DashboardScreens/PrimaryDashboardScreen.js'
import RegisterScreen from './LoginScreens/Register.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LessonsScreen from './VideoChatScreens/LessonsScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {persistor, store} from './configStore';
import { 
  Navbar, 
  Nav, 
  NavDropdown, 
} from "react-bootstrap";

//root class, all other classes are connected throught this class with react-router
export default class App extends React.Component {
  render() {
    return (
      <Provider store = {store} >
        <PersistGate loading = {null} persistor = {persistor}>
          <Router>
            <div value = "mainDiv">
            <Navbar sticky="top" bg="Spring-Wood" className="nav-bar">
              <Navbar.Brand href="/home">MusicChat</Navbar.Brand>
              <Navbar.Toggle aria-controls="first-navbar-nav" />
              <Navbar.Collapse id="first-navbar-nav">
                <Nav className = "mrAuto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/lessons">Lessons</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">If</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">We</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Want</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

              {/*
                A <Switch> looks through all its children <Route>
                elements and renders the first one whose path
                matches the current URL. Use a <Switch> any time
                you have multiple routes, but you want only one
                of them to render at a time
              */}
              <Switch>
                <Route exact path="/">
                  <InfoScreen />
                </Route>
                <Route exact path="/home">
                  <InfoScreen />
                </Route>
                <Route exact path="/login">
                  <LoginScreen />
                </Route>
                <Route exact path="/register">
                  <RegisterScreen />
                </Route>
                <Route exact path="/lessons">
                  <PrimaryDashboardScreen />
                </Route>
              </Switch>
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

