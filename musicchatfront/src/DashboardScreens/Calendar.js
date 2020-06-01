import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";
import ViewLessonModal from "./components/ViewLessonModal.js";

const localizer = momentLocalizer(moment);

class MainCalendar extends Component {
  constructor() {
    super();
    this.state = {
      lessons: [],
      selectedTitle: "",
      selectedStart: new Date(),
      selectedEnd: new Date(),
      selectedTeacherId: "",
      selectedStudentId: "",
      showViewLessonModal: false,
    };
  }
  componentDidMount() {
    axios
      .get(`http://localhost:3001/get/lessons/${this.props.user.auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        //change the response so it sends json, then its working
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          lessons: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  eventSelected = (event, e) => {
    this.setState({
      selectedTitle: event.title,
      selectedStart: event.start,
      selectedEnd: event.end,
      selectedTeacherId: event.teacher_id,
      selectedStudentId: event.student_id,
      showViewLessonModal: true,
    });
    console.log("hi " + event.student_id);
  };
  closeLessonModal = () => {
    this.setState({
      showViewLessonModal: false,
    });
  };
  render() {
    return (
      <div className="calendar-container">
        <h1>Here's Your Music Schedule</h1>
        <hr />
        <div style={{ height: "500px", width: "80%" }}>
          <Calendar
            events={this.state.lessons}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            localizer={localizer}
            selectable={true}
            onSelectEvent={this.eventSelected}
          />
        </div>
        <ViewLessonModal
          start={this.state.selectedStart}
          end={this.state.selectedEnd}
          student_id={this.state.student_id}
          teacher_id={this.state.teacher_id}
          title={this.state.selectedTitle}
          closeLessonModal={this.closeLessonModal}
          openLessonModal={this.state.showViewLessonModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainCalendar);
