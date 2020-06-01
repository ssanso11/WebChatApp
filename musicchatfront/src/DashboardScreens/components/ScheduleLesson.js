// schedule data in this json
// {
//     id: 0,
//     title: 'All Day Event very long title',
//     start: new Date(2015, 3, 0),
//     end: new Date(2015, 3, 1),
// },

import React from "react";
import { Modal, Form, Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const timeConfig = [
  { key: 15, value: "15min", text: "15 min" },
  { key: 20, value: "20min", text: "20 min" },
  { key: 30, value: "30min", text: "30 min" },
  { key: 45, value: "45min", text: "45 min" },
  { key: 60, value: "60min", text: "1 hour" },
];

const ScheduleLesson = ({
  addLesson,
  openSchedule,
  closeSchedule,
  teachers,
  startDate,
  handleChangeDate,
  handleSelectTeacher,
  handleSelectDuration,
}) => (
  <Modal
    className="schedule-lesson-modal"
    open={openSchedule}
    onClose={closeSchedule}
  >
    <h1>Schedule</h1>
    <Form>
      <Form.Field>
        <DatePicker
          selected={startDate}
          onChange={(date) => handleChangeDate(date)}
          showTimeSelect
          minDate={new Date()}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Click to select a date"
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Select Duration"
          search
          selection
          onChange={handleSelectDuration}
          options={timeConfig}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Select Teacher"
          search
          selection
          onChange={handleSelectTeacher}
          options={teachers}
        />
      </Form.Field>
      <button onClick={addLesson} className="schedule-lesson-button">
        Submit
      </button>
    </Form>
  </Modal>
);
export default ScheduleLesson;
