import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import LessonsScreen from "../VideoChatScreens/LessonsScreen";
import LoginScreen from "../LoginScreens/Login.js";
import InfoScreen from "./InfoScreen.js";
import RegisterScreen from "../LoginScreens/Register.js";
import TeacherRegister from "../LoginScreens/TeacherRegister";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class LoggedOutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNav: true,
    };
  }
  componentWillReceiveProps() {
    if (this.props.location.pathname === "/") {
      this.setState({
        displayNav: true,
      });
    } else if (this.props.location.pathname === "/register/teacher") {
      this.setState({
        displayNav: false,
      });
    }
  }
  render() {
    console.log(this.state.displayNav);
    let navbar =
      this.state.displayNav === true ? (
        <Navbar>
          <Navbar.Brand href="/home">MusicChat</Navbar.Brand>
          <Navbar.Toggle aria-controls="first-navbar-nav" />
          <Navbar.Collapse id="first-navbar-nav">
            <Nav className="mrAuto">
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
      ) : (
        ""
      );
    return (
      <Router>
        <div value="mainDiv">
          {navbar}

          {/*
                  A <Switch> looks through all its children <Route>
                  elements and renders the first one whose path
                  matches the current URL. Use a <Switch> any time
                  you have multiple routes, but you want only one
                  of them to render at a time
                */}
          <Switch>
            <Route exact path="/" component={InfoScreen} />
            <Route exact path="/home" component={InfoScreen} />
            <Route exact path="/login" component={LoginScreen} />
            <Route exact path="/register" component={RegisterScreen} />
            <Route exact path="/lessons" component={LessonsScreen} />
            <Route exact path="/register/teacher" component={TeacherRegister} />
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

export default connect(mapStateToProps, null)(withRouter(LoggedOutScreen));
