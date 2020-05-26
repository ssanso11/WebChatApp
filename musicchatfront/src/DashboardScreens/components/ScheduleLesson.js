// schedule data in this json
// {
//     id: 0,
//     title: 'All Day Event very long title',
//     allDay: true,
//     start: new Date(2015, 3, 0),
//     end: new Date(2015, 3, 1),
// },

import React, { Component } from "react";
import moment from "moment";
import { Card, Modal, Form, Dropdown } from "semantic-ui-react";

//const DropdownItems = ({ teacherName }) => <Dropdown.Item text={teacherName} />;

const ScheduleLesson = ({
  addLesson,
  openSchedule,
  closeSchedule,
  teachers,
}) => (
  <Modal
    className="schedule-lesson-modal"
    open={openSchedule}
    onClose={closeSchedule}
  >
    <h1>Schedule</h1>
    <Form style={{ margin: "20px" }}>
      <Form.Field>
        <Dropdown
          label="Teacher"
          name="teacher"
          //   value={this.props.pieceTitle}
          //   onChange={this.onChangeModalText}
          placeholder="Teacher..."
          selection
          options={teachers.firstName}
        />
      </Form.Field>
      <Form.Field>
        <Form.Input
          label="Day"
          name="day"
          //   value={this.state.composer}
          //   onChange={this.onChangeModalText}
          placeholder="Day..."
        />
      </Form.Field>
    </Form>

    <button onClick={addLesson} className="schedule-lesson-button">
      Submit
    </button>
  </Modal>
);
export default ScheduleLesson;
