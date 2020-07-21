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
import "../styles/StudentStyles/HomeDashboard.css";
import Video from "twilio-video";
import Fullscreen from "react-full-screen";
import { Spring, animated } from "react-spring/renderprops";

const IncomingCallDiv = ({
  // instrument,
  // image,
  // firstName,h
  // lastName,
  // lessons,
  // _id,
  from_id,
  to_id,
  _id,
  joinCall,
}) => (
  <div>
    <h1>Call from {from_id}</h1>
    <button onClick={() => joinCall(_id)}>Join Call</button>
  </div>
);
const TeacherCard = ({
  instrument,
  image,
  firstName,
  lastName,
  lessons,
  _id,
  startCall,
  userId,
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
    <button
      className="student-call-button"
      onClick={() => startCall(userId, _id)}
    >
      Call
    </button>
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

    this.localMedia = React.createRef();
    this.remoteMedia = React.createRef();
    this.participantDiv = React.createRef();

    this.state = this.getInitialState();

    this.joinRoom = this.joinRoom.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
    this.participantConnected = this.participantConnected.bind(this);
  }

  getInitialState = () => ({
    /* state props */
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
    incomingCallData: [],
    identity: null,
    token: "",
    previewTracks: null,
    roomName: "",
    localMediaAvailable: false /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */,
    hasJoinedRoom: false,
    activeRoom: null, // Track the current active room
    pieces: [],
    annotateActive: false,
    participants: false,
  });

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
    axios
      .get(
        `http://localhost:3001/calls/${this.props.user.auth.userId}/subscribe`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: "same-origin",
        }
      )
      .then((response) => {
        var auth = response.data;
        console.log("new call!!");
        console.log(auth);
        this.setState({
          roomName: "" + auth._id,
          incomingCallData: [auth],
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("http://localhost:3001/generatetoken/student", {
        withCredentials: "same-origin",
      })
      .then((results) => {
        console.log(results.data.token);
        var id = results.data.identity;
        var tokenGet = results.data.token;
        this.setState({ identity: id, token: tokenGet });
      });
  }

  leaveRoom() {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  }
  joinRoom() {
    console.log(this.state.roomName);

    let connectOptions = {
      name: this.state.roomName,
      //logLevel: "debug",
    };
    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }
    //connect to a video, callback is roomJoined
    Video.connect(this.state.token, connectOptions).then(
      (room) => {
        this.roomJoined(room);
      },
      (error) => {
        console.log(error);
        alert("Could not connect to Twilio: " + error.message);
      }
    );
  }

  roomJoined(room) {
    //set state
    console.log("joined");
    console.log(this.state.roomName);

    this.setState({
      hasJoinedRoom: true,
      activeRoom: room,
      localMediaAvailable: true,
    });
    // Attach LocalParticipant's tracks to the DOM, if not already attached.
    console.log(this.localMedia.current);
    var previewContainer = this.localMedia.current;
    if (!previewContainer.querySelector("video")) {
      this.attachTracks(
        this.getTracks(room.localParticipant),
        previewContainer
      );
    }
    //for users joining room
    // Attach the Tracks of the room's participants.
    const localParticipant = room.localParticipant;
    console.log(
      `Connected to the Room as LocalParticipant "${localParticipant.identity}"`
    );
    console.log(room.participants.size);

    room.participants.forEach(this.participantConnected);

    // Participant joining room
    room.on("participantConnected", this.participantConnected);

    // Attach participant’s tracks to DOM when they add a track
    room.on("trackAdded", (track, participant) => {
      console.log("here we go");
      console.log(participant.identity + " added track: " + track.kind);
      var previewContainer = this.remoteMedia.current;
      this.attachTracks([track], previewContainer);
    });

    // Detach participant’s track from DOM when they remove a track.
    room.on("trackRemoved", (track, participant) => {
      this.log(participant.identity + " removed track: " + track.kind);
      this.detachTracks([track]);
    });

    // Detach all participant’s track when they leave a room.
    room.on("participantDisconnected", (participant) => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });

    // Once the local participant leaves the room, detach the Tracks
    // of all other participants, including that of the LocalParticipant.
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach((track) => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.setState({
        activeRoom: null,
        hasJoinedRoom: false,
        localMediaAvailable: false,
      });
    });
  }

  participantConnected(participant) {
    this.setState({
      participants: true,
    });
    console.log('Participant "%s" connected', participant.identity);

    const div = this.participantDiv.current;
    div.id = participant.sid;
    //div.innerText = participant.identity;

    participant.on("trackSubscribed", (track) => {
      div.appendChild(track.attach());
    });
    participant.on("trackUnsubscribed", (track) => {
      track.detach().forEach((element) => element.remove());
    });

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        div.appendChild(publication.track.attach());
      }
    });

    //document.body.appendChild(div);
  }

  // Attach the Tracks to the DOM.
  attachTracks(tracks, container) {
    tracks.forEach((track) => {
      console.log(track.attach());
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  attachParticipantTracks(participant, container, isLocal) {
    var tracks = this.getTracks(participant);
    this.attachTracks(tracks, container, isLocal);
  }

  // Get the Participant's Tracks.
  getTracks(participant) {
    return Array.from(participant.tracks.values())
      .filter(function (publication) {
        return publication.track;
      })
      .map(function (publication) {
        return publication.track;
      });
  }

  //REMOTE MEDIA
  detachTracks(tracks) {
    tracks.forEach((track) => {
      track.detach().forEach((detachedElement) => {
        detachedElement.remove();
      });
    });
  }
  detachParticipantTracks(participant) {
    var tracks = this.getTracks(participant);
    this.detachTracks(tracks);
  }

  startCall = (from_id, to_id) => {
    console.log("starting call...");
    var data = {
      from_id: from_id,
      to_id: to_id,
    };
    axios
      .post(`http://localhost:3001/add/call`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    console.log("data");
    console.log(this.state.incomingCallData);
    //const { username, email, userId } = this.props.user.auth;
    //const { file } = this.state.file;
    const teacherMap =
      this.state.teachers.length !== 0 ? (
        <div className="teachers-grid">
          {this.state.teachers.map((teacher) => (
            <TeacherCard
              userId={this.props.user.auth.userId}
              instrument={teacher.instrument}
              image={teacher.image}
              firstName={teacher.firstName}
              lastName={teacher.lastName}
              lessons={teacher.lessons}
              _id={teacher._id}
              startCall={this.startCall}
            />
          ))}
        </div>
      ) : (
        <div>
          <h1>No teachers</h1>
        </div>
      );
    const pieceMap =
      this.state.pieces.length !== 0 ? (
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
      ) : (
        <div>
          <h4>No pieces yet. Add some to view!</h4>
        </div>
      );
    console.log(this.state.teacherDropdownOptions);
    const personTop = this.state.participants ? (
      <div className="person-top" ref={this.participantDiv} />
    ) : (
      ""
    );
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="main-container">
        {personTop}
        <Spring
          native
          to={{
            height: this.state.participants ? "25%" : "100%",
            width: this.state.participants ? "15%" : "100%",
            margin: this.state.participants ? "10px" : "0px",
            position: "absolute",
            top: "0",
            right: "0",
            overlay: "hidden",
          }}
        >
          {(props) => (
            <animated.div style={props}>
              {" "}
              <div ref={this.localMedia}></div>
              <div className="remote-div">
                <div ref={this.remoteMedia}></div>
              </div>
            </animated.div>
          )}
        </Spring>
        <div className="buttons">
          <button className="annotate"></button>
          <button className="button1" onClick={this.leaveRoom}></button>
          <button className="button2"></button>
        </div>
      </div>
    ) : (
      ""
    );
    const callPopup =
      this.state.incomingCallData.length !== 0
        ? this.state.incomingCallData.map((call) => (
            <IncomingCallDiv
              from_id={call.from_id}
              to_id={call.to_id}
              _id={call._id}
              joinCall={this.joinRoom}
            />
          ))
        : "";
    return (
      <div className="dashboard-main">
        <Fullscreen enabled={this.state.hasJoinedRoom}>
          <div className="video-container">{showLocalTrack}</div>
        </Fullscreen>
        {callPopup}
        <div className="teachers-container">
          <div className="dashboard-header">
            <h1 className="teachers-header">My Teachers</h1>
            <button className="schedule-button" onClick={this.openSchedule}>
              Schedule a lesson
            </button>
          </div>
          {teacherMap}
        </div>
        <div className="pieces-container">
          <div className="pieces-header">
            <h1 className="pieces-text">My Pieces</h1>
            <button onClick={this.addPiece} className="pieces-button">
              Add a piece
            </button>
          </div>
          {pieceMap}
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
