import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { logoutTeacher } from "../../actions/logoutTeacher";
import "../../styles/TeacherLanding.css";
import dummyImage from "../../images/music-teacher.jpg";
import { Card, Modal, Form } from "semantic-ui-react";

const RequestCard = ({
  // instrument,
  // image,
  // firstName,
  // lastName,
  // lessons,
  // _id,
  student_id,
  teacher_id,
  acceptRequest,
}) => (
  <Card style={{ textAlign: "center" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div
      className="student-request-profile"
      style={{ display: "flex", margin: "0 auto" }}
    >
      <img src={dummyImage} className="teacher-card-image" />

      <p className="teacher-name">{student_id}</p>
    </div>
    <hr
      style={{
        width: "50%",
        margin: "0 auto",
        marginTop: "15px",
        color: "#707070",
      }}
    />
    <button
      className="requests-button"
      onClick={acceptRequest(teacher_id, student_id)}
    >
      Accept
    </button>
    <button className="requests-button">Chat</button>
  </Card>
);
const StudentCard = ({
  // instrument,
  // image,
  // firstName,
  // lastName,
  // lessons,
  // _id,
  student_id,
  teacher_id,
}) => (
  <Card style={{ textAlign: "center" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div
      className="student-request-profile"
      style={{ display: "flex", margin: "0 auto" }}
    >
      <img src={dummyImage} className="teacher-card-image" />

      <p className="teacher-name">{student_id}</p>
    </div>
    <hr
      style={{
        width: "50%",
        margin: "0 auto",
        marginTop: "15px",
        color: "#707070",
      }}
    />
    <button className="requests-button">Chat</button>
  </Card>
);
class TeacherLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      requests: [],
    };
  }

  acceptRequest = (teacher_id, student_id) => {
    var data = {
      teacher_id: teacher_id,
      student_id: student_id,
    };
    axios
      .post(`http://localhost:3001/modify/relationship`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        // this.setState({
        //   requests: auth,
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    const { firstName, lastName, email, userId } = this.props.teacher.auth;
    axios
      .get(`http://localhost:3001/get/teacher/${userId}/requests`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        this.setState({
          requests: auth,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`http://localhost:3001/get/teacher/${userId}/students`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        this.setState({
          students: auth,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    const { firstName, lastName, email, userId } = this.props.teacher.auth;
    const requestsMap =
      this.state.requests.length !== 0 ? (
        <div className="requests-grid">
          {this.state.requests.map((request) => (
            <RequestCard
              acceptRequest={this.acceptRequest}
              student_id={request.student_id}
              teacher_id={userId}
              key={request.student_id}
            />
          ))}
        </div>
      ) : (
        <div>
          <h4>No new requests.</h4>
        </div>
      );
    const studentsMap =
      this.state.students.length !== 0 ? (
        <div className="requests-grid">
          {this.state.students.map((student) => (
            <StudentCard
              student_id={student.student_id}
              teacher_id={userId}
              key={student.student_id}
            />
          ))}
        </div>
      ) : (
        <div>
          <h4>No students yet. Add some from the discover page!</h4>
        </div>
      );
    return (
      <div className="teacher-landing-main">
        <h1>Welcome Back, {firstName}</h1>
        <div className="incoming-requests-container">
          <div className="incoming-requests-header">
            <h1 className="incoming-requests-header">New Student Requests</h1>
          </div>
          {requestsMap}
        </div>
        <div className="teacher-students-container">
          <div className="teacher-students-header">
            <h1 className="teacher-students-text">My Students</h1>
          </div>
          {studentsMap}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherLanding);
