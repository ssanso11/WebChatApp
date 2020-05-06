import React from "react";
import {
  Card,
  Nav,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import axios from "axios";
import TeacherRegister from "./TeacherRegister";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getUser } from "../actions/userAction";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "../styles/Register.css";

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleEmailRegister = this.handleEmailRegister.bind(this);
    this.handlePasswordRegister = this.handlePasswordRegister.bind(this);
    this.handlePasswordConf = this.handlePasswordConf.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
  }

  getInitialState = () => ({
    /* state props */
    emailLogin: "",
    passwordLogin: "",
    emailRegister: "",
    passwordRegister: "",
    passwordConf: "",
    usernameRegister: "",
    isAuthenticated: false,
  });

  handleSubmitRegister(event) {
    event.preventDefault();
    this.setState(this.getInitialState());
    const email = this.state.emailRegister;
    const username = this.state.usernameRegister;
    const password = this.state.passwordRegister;
    const passwordConf = this.state.passwordConf;
    var data = {
      email: email,
      username: username,
      password: password,
      passwordConf: passwordConf,
    };
    console.log(data);
    axios
      .post("http://localhost:3001/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        if (auth.userId != null) {
          alert("Created user " + auth.username);
          this.props.add({ auth });
          this.setState({
            isAuthenticated: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleEmailRegister(event) {
    this.setState({ emailRegister: event.target.value });
  }
  handlePasswordRegister(event) {
    this.setState({ passwordRegister: event.target.value });
  }
  handlePasswordConf(event) {
    this.setState({ passwordConf: event.target.value });
  }
  handleUsername(event) {
    this.setState({ usernameRegister: event.target.value });
  }
  render() {
    if (this.state.isAuthenticated === true) {
      return (
        <Router>
          <Redirect to="/" />
        </Router>
      );
    }
    return (
      <Router>
        <div className="register-container">
          <div className="register-info">
            <h1>Register</h1>
          </div>
          <Card className="card-container" bg="Spring-Wood">
            <Card.Header className="card-header">
              <Nav
                justify
                className="nav-register"
                variant="pills"
                defaultActiveKey="#student"
              >
                <Nav.Item>
                  <Nav.Link href="#student">Student</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/register/teacher">Teacher</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body className="card-body">
              <div className="card-register">
                <form onSubmit={this.handleSubmitRegister}>
                  <FormGroup className="form-div">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                      className="form-username"
                      placeholder="Username"
                      onChange={this.handleUsername}
                    />
                    <FormLabel>Email</FormLabel>
                    <FormControl
                      type="email"
                      placeholder="name@example.com"
                      onChange={this.handleEmailRegister}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Password</FormLabel>
                    <FormControl
                      type="password"
                      placeholder="Password"
                      onChange={this.handlePasswordRegister}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                      type="password"
                      placeholder="Confirm password"
                      onChange={this.handlePasswordConf}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      className="register-button"
                      variant="dark"
                      type="submit"
                    >
                      Register
                    </Button>
                  </FormGroup>
                </form>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Switch>
          <Route exact path="/register/teacher">
            <TeacherRegister />
          </Route>
        </Switch>
      </Router>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    add: (user) => {
      dispatch(getUser(user));
    },
  };
};

export default connect(null, mapDispatchToProps)(RegisterScreen);
