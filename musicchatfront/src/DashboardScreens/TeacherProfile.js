import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Card, Modal } from "semantic-ui-react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import dummyImage from "../images/music-teacher.jpg";
import "../styles/TeacherProfile.css";

export default class TeacherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      instrument: "",
      bio: "",
    };
  }
  componentDidMount() {
    console.log(this.props.match);
    axios
      .get(`http://localhost:3001/get/teacher/${this.props.match.params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        //change the response so it sends json, then its working
      })
      .then((response) => {
        var data = response.data;
        console.log(response.data);
        this.setState({
          firstName: data.firstName,
          lastName: data.lastName,
          instrument: data.instrument,
          bio: data.bio,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (
      <div className="teacher-profile-main">
        <div className="about-info">
          <div className="basic-info-div">
            <img className="teacher-image" src={dummyImage} />
            <div className="name-instrument-header">
              <h1>{`${this.state.firstName} ${this.state.lastName}`}</h1>
              <h2>{this.state.instrument}</h2>
            </div>
          </div>
          <div className="personal-info-div">
            <h1>{`About ${this.state.firstName}`}</h1>
            <hr />
            <p className="personal-info-bio">{this.state.bio}</p>
          </div>
        </div>
        <div className="payment-info-div">
          <Card className="payment-info-card">
            <div className="payment-header-div">
              <h1>$60/hour</h1>
            </div>
            <div className="payment-body-div">
              <h3 className="payment-reassurance-text">
                No confidence? No problem
              </h3>
              <h3 className="payment-reassurance-text">
                We offer 100% money-back guarantee
              </h3>
              <button className="contact-teacher-button">Contact</button>
              <p>Already your teacher?</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
