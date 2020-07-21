import React from "react";
import "./App.css";
import LoggedInScreen from "./HomeScreens/LoggedInScreen";
import LoggedOutScreen from "./HomeScreens/LoggedOutScreen";
import TeacherHome from "./DashboardScreens/TeacherDash/TeacherHome.js";
import { connect } from "react-redux";
import { logoutUser } from "./actions/logoutAction";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "./firebase";
//root class, all other classes are connected throught this class with react-router
class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = this.currentUser.bind(this);
  }
  componentDidMount() {
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then((token) => {
        console.log("Token: " + token);
      })
      .catch(() => {
        console.log("token error");
      });
    this.currentUser();
  }
  currentUser = () => {
    //change this soon
    if (this.props.user === "not authenticated") {
      console.log("ERROR, not authenticated");
    } else {
      console.log(this.props.user);
    }
  };

  render() {
    if (this.props.user !== "not authenticated") {
      return (
        <Router>
          <Switch>
            <Route path="/" component={LoggedInScreen} />
          </Switch>
        </Router>
      );
    } else if (this.props.teacher !== "not authenticated") {
      console.log("redirecting to teacher dash");
      return (
        <Router>
          <Switch>
            <Route path="/" component={TeacherHome} />
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Switch>
            <Route path="/" component={LoggedOutScreen} />
          </Switch>
        </Router>
      );
    }
  }
}

const mapStateToProps = (state) => {
  const { user, teacher } = state;
  return { user, teacher };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: (user) => {
      dispatch(logoutUser(user));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
