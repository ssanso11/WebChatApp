import React from "react";
import { Button, Form, Checkbox } from "semantic-ui-react";
import axios from "axios";
import { Spring, Trail } from "react-spring/renderprops";
import { connect } from "react-redux";
import { getTeacher } from "../actions/teacherAction";
import { Redirect, BrowserRouter as Router, Link } from "react-router-dom";
import TeacherStepOne from "./TeacherStepOne";
import TeacherStepTwo from "./TeacherStepTwo";
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
    instrument: "",
    bio: "",
    isAuthenticated: false,
    step: 1,
  });
  onNext = async () => {
    this.setState({
      step: 2,
    });
  };
  onChangeInstrument = (e, { value }) => {
    console.log(value);
    this.setState({
      instrument: value,
    });
  };
  onSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      passwordConf,
      bio,
      instrument,
    } = this.state;

    var data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConf: passwordConf,
      bio: bio,
      instrument: instrument,
    };
    console.log(data.instrument);
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
    const setupStep =
      this.state.step === 1 ? (
        <TeacherStepOne
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.state.email}
          password={this.state.password}
          passwordConf={this.state.passwordConf}
          onNext={this.onNext}
          onChange={this.onChange}
        />
      ) : (
        <TeacherStepTwo
          bio={this.state.bio}
          instrument={this.state.instrument}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onChangeInstrument={this.onChangeInstrument}
        />
      );
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
          {setupStep}
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
