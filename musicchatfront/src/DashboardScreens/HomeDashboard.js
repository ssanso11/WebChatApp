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

const teacherCard = ({
  instrument,
  image,
  firstName,
  lastName,
  lessons,
  _id,
}) => (
  <Card style={{ textAlign: "center" }}>
    <h1 style={{ color: "#6470FF" }}>{instrument}</h1>

    <div className="card-profile" style={{ display: "flex", margin: "0 auto" }}>
      <Link to={`/profile/${_id}`}>
        <img src={dummyImage} className="teacher-card-image" />
      </Link>

      <Link to={`/profile/${_id}`}>
        <p className="teacher-name">{firstName + " " + lastName}</p>
      </Link>
    </div>

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

const PiecesCard = ({ title, composer, piece, showPdf }) => {
  return (
    <Card onClick={() => showPdf(piece)}>
      <div className="piece-flex" style={{ overflow: "hidden" }}>
        <Document file={piece}>
          <Page pageNumber={1} width={80} height={75} />
        </Document>
        <div style={{ textAlign: "center" }}>
          <h2 className="piece-title">{title}</h2>
          <p className="piece-composer"> {composer}</p>
        </div>
      </div>
    </Card>
  );
};

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
        var arr = [];
        response.data.forEach((teacher) => {
          var tester = {
            key: "",
            value: "",
            text: "",
          };
          tester.key = teacher._id;
          tester.text = teacher.firstName;
          tester.value = teacher.firstName;
          arr.push(tester);
        });

        this.setState({
          teachers: response.data,
          teacherDropdownOptions: arr,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`http://localhost:3001/get/pieces/${this.props.user.auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        //change the response so it sends json, then its working
      })
      .then((response) => {
        console.log(response.data);
        if (typeof response.data.data !== "undefined") {
          this.setState({
            pieces: response.data.data,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //upload pdf to s3 bucket, then post url to student pieces array in mongodb
  addPiece = () => {
    this.setState({
      addPieceActive: true,
    });
  };
  uploadPiece = () => {
    const data = new FormData();
    data.append("file", this.state.file, this.state.file.name);

    axios
      .post("http://localhost:3001/upload/piece", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        //store res.location in array of pieces
        var res = response;
        var pieceData = {
          title: this.state.pieceTitle,
          composer: this.state.composer,
          pieceUrl: res.data.Location,
          userId: this.props.user.auth.userId,
        };
        axios
          .post("http://localhost:3001/upload/piece/mongo", pieceData, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: "same-origin",
            //change the response so it sends json, then its working
          })
          .then((response) => {
            //store res.location in array of pieces
            var res = response;

            console.log(res);
            this.closeAddPiece();
          })
          .catch((error) => {
            console.error(error);
          });
        console.log(res.data.Location);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  closeAddPiece = () => {
    this.setState({
      addPieceActive: false,
    });
  };
  onChangeModalText = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  showPdf = (piece) => {
    this.setState({
      showPdf: true,
      pdfToShow: piece,
    });
    console.log("showing");
  };
  closePdf = () => {
    this.setState({
      showPdf: false,
    });
  };
  openSchedule = () => {
    console.log("yay");
    this.setState({
      showSchedule: true,
    });
  };
  closeSchedule = () => {
    this.setState({
      showSchedule: false,
    });
  };
  addLesson = () => {
    var lessonData = {
      title: `Lesson with ${this.state.selectedteacherName}`,
      startTime: this.state.startDate,
      endTime: this.state.endDate,
      teacher_id: this.state.selectedTeacherKey,
      student_id: this.props.user.auth.userId,
    };
    axios
      .post("http://localhost:3001/upload/lesson", lessonData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
        //change the response so it sends json, then its working
      })
      .then((response) => {
        //store res.location in array of pieces
        var res = response;

        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  handleChangeDate = (date) => {
    this.setState({
      startDate: date,
    });
  };
  handleSelectTeacher = (event, data) => {
    const { value } = data;
    const { key } = data.options.find((o) => o.value === value);
    this.setState({
      selectedTeacherKey: key,
      selectedteacherName: data.value,
    });
  };
  handleSelectDuration = (event, data) => {
    const { value } = data;
    const { key } = data.options.find((o) => o.value === value);

    var endDate = moment(this.state.startDate).add(key, "m").toDate();
    console.log(endDate);
    this.setState({
      endDate: endDate,
    });
  };
  render() {
    //const { username, email, userId } = this.props.user.auth;
    //const { file } = this.state.file;
    console.log(this.state.teacherDropdownOptions);
    return (
      <div className="dashboard-main">
        <div className="teachers-container">
          <div className="dashboard-header">
            <h1 className="teachers-header">My Teachers</h1>
            <button className="schedule-button" onClick={this.openSchedule}>
              Schedule a lesson
            </button>
          </div>
          <div className="teachers-grid">
            {this.state.teachers.map(teacherCard)}
          </div>
        </div>
        <div className="pieces-container">
          <div className="pieces-header">
            <h1 className="pieces-text">My Pieces</h1>
            <button onClick={this.addPiece} className="pieces-button">
              Add a piece
            </button>
          </div>
          <div className="pieces-grid">
            {this.state.pieces.map((p) => (
              <PiecesCard
                title={p.title}
                composer={p.composer}
                piece={p.piece}
                showPdf={this.showPdf}
              />
            ))}
          </div>
        </div>
        {/* put in component folder */}
        <Modal
          className="add-piece-modal"
          open={this.state.addPieceActive}
          onClose={this.closeAddPiece}
        >
          <h1>Add a piece</h1>
          <FilePicker
            className="button"
            maxSize={1}
            buttonText="Upload a file!"
            extensions={["application/pdf"]}
            onChange={(file) => this.setState({ file })}
            onError={(error) => {
              alert("that's an error: " + error);
            }}
            onClear={() => this.setState({ file: {} })}
          >
            <div className="input-button" type="button">
              The file picker
            </div>
          </FilePicker>
          <Form style={{ margin: "20px" }}>
            <Form.Field>
              <Form.Input
                label="Title of piece"
                name="pieceTitle"
                value={this.props.pieceTitle}
                onChange={this.onChangeModalText}
                placeholder="Title..."
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label="Composer"
                name="composer"
                value={this.state.composer}
                onChange={this.onChangeModalText}
                placeholder="Composer..."
              />
            </Form.Field>
          </Form>

          <button onClick={this.uploadPiece} className="add-piece-button">
            Submit
          </button>
        </Modal>
        <Modal
          className="show-piece-modal"
          open={this.state.showPdf}
          onClose={this.closePdf}
        >
          <div style={{ height: "100%", width: "100%", overflowY: "scroll" }}>
            <Document
              file={this.state.pdfToShow}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              {[...Array(this.state.numPages)].map((e, i) => (
                <Page pageNumber={i + 1} style={{ objectFit: "cover" }} />
              ))}
            </Document>
          </div>
        </Modal>

        <ScheduleLesson
          openSchedule={this.state.showSchedule}
          closeSchedule={this.closeSchedule}
          addLesson={this.addLesson}
          teachers={this.state.teacherDropdownOptions}
          startDate={this.state.startDate}
          handleChangeDate={this.handleChangeDate}
          handleSelectTeacher={this.handleSelectTeacher}
          handleSelectDuration={this.handleSelectDuration}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);
