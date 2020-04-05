import React from 'react';
import './App.css';
import LoggedInScreen from './HomeScreens/LoggedInScreen';
import LoggedOutScreen from './HomeScreens/LoggedOutScreen'
import { connect } from 'react-redux';
import {logoutUser} from './actions/logoutAction'


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

    }
    else {
      return (
        <LoggedOutScreen />
      );
    }
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