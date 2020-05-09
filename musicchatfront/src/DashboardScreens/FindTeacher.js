import React from "react";
import "../styles/FindTeacher.css";
import { Button, Select, Input, Card } from "semantic-ui-react";
import dummyImage from "../images/music-teacher.jpg";
import { connect } from "react-redux";
import { logoutUser } from "../actions/logoutAction";
import TeacherCard from "./TeacherDash/Components/TeacherCard";
import axios from "axios";

class FindTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3001/get/teachers", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          teachers: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  addTeacher = (id) => {
    console.log(this.props.user.auth.userId);
    var data = {
      user_id: this.props.user.auth.userId,
      teacher_id: id,
    };
    axios
      .post("http://localhost:3001/add/teachers", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return (
      <div className="find-teacher-container">
        <div className="find-teacher-header">
          <h1 className="find-text">Find a Teacher</h1>
          <div className="search-bar">
            <Input
              fluid
              icon="search"
              type="text"
              placeholder="Search..."
              action
            >
              <input />
              <Select
                options={instruments}
                placeholder="Instrument"
                defaultValue="default"
              />
              <Button
                type="submit"
                size="medium"
                style={{ color: "white", backgroundColor: "#6470FF" }}
              >
                Search
              </Button>
            </Input>
          </div>
        </div>
        <div className="search-results-container">
          <p>24 Teachers matching your search results</p>
          <div className="teacher-results-grid">
            {this.state.teachers.map((teacher) => (
              <TeacherCard
                firstName={teacher.firstName}
                lastName={teacher.lastName}
                _id={teacher._id}
                addTeacher={this.addTeacher}
              />
            ))}
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FindTeacher);

const instruments = [
  { key: "default", text: "Instrument", value: "default" },
  { key: "accordion", text: "Accordion", value: "accordion" },
  { key: "bagpipe", text: "Bagpipe", value: "bagpipe" },
  { key: "banjo", text: "Banjo", value: "banjo" },
  { key: "bass guitar", text: "Bass Guitar", value: "bass guitar" },
  { key: "bassoon", text: "Bassoon", value: "bassoon" },
  { key: "bugle", text: "Bugle", value: "bugle" },
  { key: "cello", text: "Cello", value: "cello" },
  { key: "clarinet", text: "Clarinet", value: "clarinet" },
  { key: "flute", text: "Flute", value: "flute" },
  { key: "French horn", text: "French Horn", value: "French horn" },
  { key: "guitar", text: "Guitar", value: "guitar" },
  { key: "harp", text: "Harp", value: "harp" },
  { key: "mandolin", text: "Mandolin", value: "mandolin" },
  { key: "oboe", text: "Oboe", value: "oboe" },
  { key: "percussion", text: "Percussion", value: "percussion" },
  { key: "piano", text: "Piano", value: "piano" },
  { key: "organ", text: "Organ", value: "organ" },
  { key: "saxophone", text: "Saxophone", value: "saxophone" },
  { key: "trombone", text: "accordion", value: "accordion" },
  { key: "tuba", text: "Tuba", value: "tuba" },
  { key: "ukulele", text: "Ukulele", value: "ukulele" },
  { key: "viola", text: "Viola", value: "viola" },
  { key: "violin", text: "Violin", value: "violin" },
];
