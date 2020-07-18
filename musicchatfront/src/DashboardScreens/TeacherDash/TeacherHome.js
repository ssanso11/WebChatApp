import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LessonsScreen from "../../VideoChatScreens/LessonsScreen";
import LoggedOutScreen from "../../HomeScreens/LoggedOutScreen.js";
import { connect } from "react-redux";
import { logoutTeacher } from "../../actions/logoutTeacher";
import { Header, Icon, Image, Menu, Segment, Sidebar } from "semantic-ui-react";
import FindTeacher from "../../DashboardScreens/FindTeacher";
import dummyImage from "../../images/music-teacher.jpg";
import "../../styles/LoggedIn.css";
import TeacherLanding from "./TeacherLanding.js";

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
  { key: 1, name: "Lessons", redirect: "/calendar" },
  { key: 2, name: "Teachers", redirect: "/lessons" },
  { key: 3, name: "Discover", redirect: "/discover" },
];

class TeacherHome extends React.Component {
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
    console.log(this.props.teacher);
    const { firstName, lastName, email, userId } = this.props.teacher.auth;
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
              height: "100%",
            }}
          >
            <Link to="/">
              <div className="sidebar-header" href="/">
                <div className="center-vert">
                  <img className="sidebar-profile-img" src={dummyImage} />
                  <h1 className="sidebar-username">{firstName}</h1>
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
              <TeacherLanding />
            </Route>
            <Route exact path="/dashboard">
              <FindTeacher />
            </Route>
            <Route exact path="/lessons">
              <FindTeacher />
            </Route>
            <Route exact path="/calendar">
              <FindTeacher />
            </Route>
            <Route exact path="/discover">
              <FindTeacher />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, teacher } = state;
  return { user, teacher };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (teacher) => {
      dispatch(logoutTeacher(teacher));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherHome);
