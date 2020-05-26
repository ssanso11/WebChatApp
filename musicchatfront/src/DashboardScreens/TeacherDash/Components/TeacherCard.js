import React from "react";
import { Button, Select, Input, Card } from "semantic-ui-react";
import dummyImage from "../../../images/music-teacher.jpg";
import "../../../styles/TeacherCard.scss";

export default ({
  instrument,
  bio,
  image,
  firstName,
  lastName,
  _id,
  addTeacher,
  isAdded,
}) => (
  <Card style={{ textAlign: "center", margin: "0 auto", width: "85%" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div className="card-profile" style={{ display: "flex", margin: "0 auto" }}>
      <img src={dummyImage} className="teacher-image" />
      <p className="teacher-name">{firstName + " " + lastName}</p>
    </div>
    <Button
      disabled={isAdded}
      onClick={() => addTeacher(_id)}
      size="medium"
      style={{
        color: "white",
        backgroundColor: "#6470FF",
        width: "20%",
        margin: "0 auto",
        marginTop: "10px",
      }}
    >
      Add
    </Button>
    <hr
      style={{
        width: "50%",
        margin: "0 auto",
        marginTop: "15px",
        color: "#707070",
      }}
    />
    <div className="next-lesson-div">
      <p className="teacher-bio">{" " + bio}</p>
    </div>
  </Card>
);
