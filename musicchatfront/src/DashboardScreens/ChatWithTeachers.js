import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { Card, Modal, Form } from "semantic-ui-react";
import { FilePicker } from "react-file-picker-preview";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import dummyImage from "../images/music-teacher.jpg";
import ScheduleLesson from "./components/ScheduleLesson.js";
import moment from "moment";
import "../styles/HomeDashboard.css";



export class HomeDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      addPieceActive: false,
      file: {},
      reset: {},
      composer: "",
      pieceTitle: "",
      pieceUrl: "",
      pieces: [],
      showPdf: false,
      pdfToShow: {},
      pageNumber: 1,
      showSchedule: false,
      numPages: 0,
      startDate: new Date(),
      endDate: new Date(),
      teacherDropdownOptions: [],
      selectedTeacherKey: "",
      selectedteacherName: "",
    };
  }

  componentDidMount() {
    var data = {
      teachers: this.props.user.auth.teachers,
    };
    axios
      .post(
        `http://localhost:3001/get/teachers/${this.props.user.auth.userId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: "same-origin",
          //change the response so it sends json, then its working
        }
      )
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

  render() {
    return (
      <div className="chat-main">
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);
