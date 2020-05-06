import React from "react";
import { Button, Form, Checkbox } from "semantic-ui-react";
import axios from "axios";
import { Spring, Trail } from "react-spring/renderprops";
import { connect } from "react-redux";
import { getTeacher } from "../actions/teacherAction";
import { Redirect, BrowserRouter as Router, Link } from "react-router-dom";
import "../styles/TeacherRegister.css";

const headings = [
  {
    id: 0,
    title: "Painless online lessons.",
  },
  {
    id: 1,
    title: "Starting now.",
  },
];

class TeacherRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    /* state props */
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConf: "",
    isAuthenticated: false,
  });

  onSubmit = async () => {
    const { firstName, lastName, email, password, passwordConf } = this.state;

    var data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConf: passwordConf,
    };
    axios
      .post("http://localhost:3001/register/teacher", data, {
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
          alert("Created teacher " + auth.firstName + auth.lastName);
          this.props.add({ auth });
          this.setState(this.getInitialState());
          this.setState({
            isAuthenticated: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    if (this.state.isAuthenticated === true) {
      return (
        <Router>
          <Redirect to="/" />
        </Router>
      );
    }
    return (
      <div className="main-container">
        <div className="grid-container">
          <div
            className="side-container"
            style={{
              textAlign: "center",
              backgroundColor: "#6470FF",
              height: "100vh",
              color: "white",
              display: "inline",
              position: "relative",
            }}
          >
            <div className="intro-text">
              <h1 style={{ fontWeight: "bold", fontSize: "60px" }}>
                Welcome to MusicChat
              </h1>
              <Trail
                delay={500}
                items={headings}
                keys={(heading) => heading.id}
                from={{
                  marginLeft: -300,
                  opacity: 0,
                }}
                to={{
                  marginLeft: 0,
                  opacity: 1,
                }}
              >
                {(heading) => (props) => (
                  <div style={props} className="header-text">
                    <h4>{heading.title}</h4>
                  </div>
                )}
              </Trail>
            </div>
          </div>

          <Spring
            from={{ opacity: 0, marginTop: -1000 }}
            to={{ opacity: 1, margin: 10 }}
          >
            {(props) => (
              <div style={props} className="teacher-register-container">
                <div className="left-container">
                  <div
                    className="form-container"
                    style={{
                      width: "90%",
                      marginLeft: "30px",
                      marginBottom: "30px",
                      marginTop: "20px",
                    }}
                  >
                    <h1
                      style={{
                        textAlign: "center",
                        color: "#6470FF",
                        marginTop: "10px",
                        fontWeight: "bold",
                        fontSize: "40px",
                      }}
                    >
                      Register as a teacher
                    </h1>
                    <Form style={{ margin: "20px" }}>
                      <Form.Group widths="equal">
                        <Form.Field>
                          <Form.Input
                            label="First Name"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.onChange}
                            placeholder="First Name"
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            label="Last Name"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.onChange}
                            placeholder="Last Name"
                          />
                        </Form.Field>
                      </Form.Group>
                      <Form.Field>
                        <Form.Input
                          label="Email"
                          type="email"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChange}
                          placeholder="example@email.com"
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Input
                          label="Password"
                          type="password"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChange}
                          placeholder="Password"
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Input
                          label="Confirm Password"
                          name="passwordConf"
                          value={this.state.passwordConf}
                          onChange={this.onChange}
                          type="password"
                          placeholder="Confirm"
                        />
                      </Form.Field>
                      <Form.Field>
                        <Checkbox label="I agree to the Terms and Conditions" />
                      </Form.Field>
                      <Button
                        style={{
                          color: "white",
                          backgroundColor: "#6470FF",
                          marginBottom: "10px",
                        }}
                        fluid
                        type="submit"
                        onClick={this.onSubmit}
                      >
                        Submit
                      </Button>
                      <Link
                        to="/"
                        style={{
                          textAlign: "center",
                          color: "#6470FF",
                        }}
                      >
                        Not a Teacher? Go back
                      </Link>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </Spring>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    add: (teacher) => {
      dispatch(getTeacher(teacher));
    },
  };
};

export default connect(null, mapDispatchToProps)(TeacherRegister);
