import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LessonsScreen from "../VideoChatScreens/LessonsScreen";
import LoggedOutScreen from "./LoggedOutScreen.js";
import { connect } from "react-redux";
import { logoutUser } from "../actions/logoutAction";
import { Header, Icon, Image, Menu, Segment, Sidebar } from "semantic-ui-react";
import MainCalendar from "../DashboardScreens/Calendar";
import HomeDashboard from "../DashboardScreens/HomeDashboard";
import FindTeacher from "../DashboardScreens/FindTeacher";
import dummyImage from "../images/music-teacher.jpg";
import withSplashScreen from "../splashscreens/withsplashScreen";
import TeacherProfile from "../DashboardScreens/TeacherProfile.js";
import "../styles/LoggedIn.css";

// Be sure to include styles at some point, probably during your bootstraping

const SidebarLabel = ({ active, name, onClick, redirect }) => {
  return (
    <Link to={redirect}>
      <div
        onClick={onClick}
        className={active ? "label-active" : "label-inactive"}
      >
        <h1 className={active ? "label-text-active" : "label-text-inactive"}>
          {name}
        </h1>
      </div>
    </Link>
  );
};

const labels = [
  { key: 0, name: "Home", redirect: "/" },
  { key: 1, name: "Schedule", redirect: "/calendar" },
  { key: 2, name: "Teachers", redirect: "/lessons" },
  { key: 3, name: "Discover", redirect: "/discover" },
];

class LoggedInScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toLoggedOut: false,
      labelIsSelected: 0,
    };
    //this.handleSelect = this.handleSelect.bind(this);
  }

  handleLogout = () => {
    //192.168.1.18 is the one at home, change for different wifis, eventually heroku
    axios
      .get("http://localhost:3001/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        var auth = response.data;
        this.props.logout("not authenticated");
        this.setState({
          toLoggedOut: true,
        });
        console.log("logged out");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSelect = (key, redirect) => {
    console.log(redirect);
    this.setState({
      labelIsSelected: key,
    });
  };

  render() {
    const { username, email, userId } = this.props.user.auth;
    if (this.state.toLoggedOut === true) {
      return (
        <Router>
          <Redirect to="/" />
        </Router>
      );
    }
    return (
      <Router>
        <div className="main-div">
          <div
            style={{
              backgroundColor: "#6470FF",
              width: "250px",
              height: "100vh",
            }}
          >
            <Link to="/">
              <div className="sidebar-header" href="/">
                <div className="center-vert">
                  <img className="sidebar-profile-img" src={dummyImage} />
                  <h1 className="sidebar-username">{username}</h1>
                </div>
              </div>
            </Link>

            <hr className="header-divisor" />
            <div className="sidebar-actions">
              {labels.map((l) => (
                <SidebarLabel
                  key={l.key}
                  name={l.name}
                  active={l.key === this.state.labelIsSelected}
                  onClick={() => this.handleSelect(l.key, l.redirect)}
                  redirect={l.redirect}
                />
              ))}
              <Link to="/logout">
                <div onClick={this.handleLogout} className="logout-div">
                  <h1 className="logout-header">Logout</h1>
                </div>
              </Link>
            </div>
          </div>

          <Switch>
            <Route exact path="/logout">
              <LoggedOutScreen />
            </Route>
            <Route exact path="/">
              <HomeDashboard />
            </Route>
            <Route exact path="/dashboard">
              <HomeDashboard />
            </Route>
            <Route exact path="/lessons">
              <LessonsScreen />
            </Route>
            <Route exact path="/calendar">
              <MainCalendar />
            </Route>
            <Route exact path="/discover">
              <FindTeacher />
            </Route>
            <Route exact path="/profile/:id" component={TeacherProfile} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (user) => {
      dispatch(logoutUser(user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSplashScreen(LoggedInScreen));
