import React from "react";
import { Button, Select, Input, Card } from "semantic-ui-react";
import dummyImage from "../../../images/music-teacher.jpg";

export default ({
  instrument,
  image,
  firstName,
  lastName,
  lessons,
  _id,
  addTeacher,
}) => (
  <Card style={{ textAlign: "center", margin: "0 auto", width: "85%" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div className="card-profile" style={{ display: "flex", margin: "0 auto" }}>
      <img src={dummyImage} className="teacher-image" />
      <p className="teacher-name">{firstName + " " + lastName}</p>
    </div>
    <Button
      disabled={false}
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
    <h2
      style={{
        marginTop: "10px",
        fontSize: "24px",
        color: "#6470FF",
        fontWeight: "bolder",
      }}
    >
      Next lesson
    </h2>
    <div className="next-lesson-div">
      <p style={{ fontSize: "18px", color: "black" }}>12 July 2020</p>
    </div>
    <div className="view-homework-div">
      <p style={{ fontSize: "18px", margin: "0 auto" }}>View Homework</p>
    </div>
  </Card>
);
