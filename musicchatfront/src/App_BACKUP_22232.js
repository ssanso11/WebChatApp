import React from 'react';
import './App.css';
<<<<<<< HEAD
import LoggedInScreen from './HomeScreens/LoggedInScreen';
import LoggedOutScreen from './HomeScreens/LoggedOutScreen'
import { connect } from 'react-redux';
import {logoutUser} from './actions/logoutAction'

=======
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
>>>>>>> cb12fdff6ff76b4cb8e5f15b88163a6584e282e1

//root class, all other classes are connected throught this class with react-router
class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = this.currentUser.bind(this);
  }
  componentDidMount() {
    this.currentUser()
  }
  currentUser = () => {
    //change this soon
    if (this.props.user == "not authenticated"){
      console.log("ERROR, not authenticated");
    }
    else {
      console.log(this.props.user) 
    }
  };

  render() {
    if(this.props.user != "not authenticated") {
      
      return (
        <LoggedInScreen />
      );

<<<<<<< HEAD
    }
    else {
      return (
        <LoggedOutScreen />
      );
    }
=======
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
>>>>>>> cb12fdff6ff76b4cb8e5f15b88163a6584e282e1
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user }
};
const mapDispatchToProps = dispatch => {
  return {
      logout: (user) => {
          dispatch(logoutUser(user));
      }
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(App);