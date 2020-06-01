import React from "react";
import { Modal, Form, Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const ViewLessonModal = ({
  start,
  end,
  teacher_id,
  student_id,
  title,
  openLessonModal,
  closeLessonModal,
}) => (
  <Modal
    className="view-lesson-modal"
    open={openLessonModal}
    onClose={closeLessonModal}
  >
    <div className="view-lesson-modal-main" style={{ display: "grid" }}>
      <div
        className="lesson-modal-header"
        style={{ backgroundColor: "#6374F7", color: "#FFFFFF" }}
      >
        <h1>{title}</h1>
        <h2>{moment(start).format("dddd")}</h2>
        <h2>{moment(start).format("MMMM Do")}</h2>
      </div>
    </div>
  </Modal>
);
export default ViewLessonModal;
