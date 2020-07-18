import React from "react";
import "../styles/Login.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getUser } from "../actions/userAction";
import {
  TextField,
  Card,
  Button,
  CardActions,
  CardContent,
} from "@material-ui/core";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getTeacher } from "../actions/teacherAction";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(event) {
    event.preventDefault();
    this.setState(this.getInitialState());
    const email = this.state.emailLogin;
    const password = this.state.passwordLogin;
    var data = { logemail: email, logpassword: password };
    //fetch login
    axios
      .post("http://localhost:3001/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        var auth = response.data;
        if (auth.userId != null) {
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
        console.log(auth.userId);
        if (auth.userId != null) {
          alert("Created user " + auth.username);
          this.setState({
            isAuthenticated: true,
          });
          this.props.history.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleTeacherSubmit = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
    const email = this.state.emailLogin;
    const password = this.state.passwordLogin;
    var data = { logemail: email, logpassword: password };
    //fetch login
    axios
      .post("http://localhost:3001/login/teacher", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        var auth = response.data;
        if (auth.userId != null) {
          this.props.addTeacher({ auth });
          this.setState({
            isAuthenticated: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  handleEmail(event) {
    this.setState({ emailLogin: event.target.value });
  }
  handlePassword(event) {
    this.setState({ passwordLogin: event.target.value });
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
    // if (this.state.isAuthenticated === true) {
    //   return (
    //     <Router>
    //       <Redirect to="/" />
    //     </Router>
    //   );
    // }
    return (
      <div className="containerLogin">
        <div className="login">
          <h1>Login</h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl
                placeholder="name@example.com"
                onChange={this.handleEmail}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Password"
                onChange={this.handlePassword}
              />
            </FormGroup>
            <FormGroup>
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </FormGroup>
            <FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleTeacherSubmit}
              >
                Login Teacher
              </Button>
            </FormGroup>
          </form>
        </div>
        <div className="register">
          <h1>Register</h1>
          <form onSubmit={this.handleSubmitRegister}>
            <FormGroup>
              <FormLabel>Username</FormLabel>
              <FormControl placeholder="Username" />
            </FormGroup>
            <FormGroup>
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
              <Button variant="contained" color="primary" type="submit">
                Register
              </Button>
            </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: (user) => {
      dispatch(getUser(user));
    },
    addTeacher: (teacher) => {
      dispatch(getTeacher(teacher));
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);
