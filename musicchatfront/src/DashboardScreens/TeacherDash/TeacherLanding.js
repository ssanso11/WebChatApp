import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { logoutTeacher } from "../../actions/logoutTeacher";
import "../../styles/TeacherLanding.css";
import dummyImage from "../../images/music-teacher.jpg";
import { Card } from "semantic-ui-react";
import Fullscreen from "react-full-screen";
import Video from "twilio-video";
import { Spring, animated } from "react-spring/renderprops";

const RequestCard = ({
  // instrument,
  // image,
  // firstName,
  // lastName,
  // lessons,
  // _id,
  student_id,
  teacher_id,
  acceptRequest,
}) => (
  <Card style={{ textAlign: "center" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div
      className="student-request-profile"
      style={{ display: "flex", margin: "0 auto" }}
    >
      <img src={dummyImage} className="teacher-card-image" />

      <p className="teacher-name">{student_id}</p>
    </div>
    <hr
      style={{
        width: "50%",
        margin: "0 auto",
        marginTop: "15px",
        color: "#707070",
      }}
    />
    <button
      className="requests-button"
      onClick={acceptRequest(teacher_id, student_id)}
    >
      Accept
    </button>
    <button className="requests-button">Chat</button>
  </Card>
);
const StudentCard = ({
  // instrument,
  // image,
  // firstName,h
  // lastName,
  // lessons,
  // _id,
  student_id,
  teacher_id,
  startCall,
}) => (
  <Card style={{ textAlign: "center" }}>
    <h1 style={{ color: "#6470FF" }}>Clarinet</h1>
    <div
      className="student-request-profile"
      style={{ display: "flex", margin: "0 auto" }}
    >
      <img src={dummyImage} className="teacher-card-image" />

      <p className="teacher-name">{student_id}</p>
    </div>
    <hr
      style={{
        width: "50%",
        margin: "0 auto",
        marginTop: "15px",
        color: "#707070",
      }}
    />
    <button
      className="call-button"
      onClick={() => startCall(teacher_id, student_id)}
    >
      Call
    </button>
  </Card>
);
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

//idea: we have to subscribe each user to database where calls will get updated.
//if user has just been added to calls database, then the ui updates

class TeacherLanding extends React.Component {
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
    students: [],
    requests: [],
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
    this.setState({
      hasJoinedRoom: true,
      activeRoom: room,
      localMediaAvailable: true,
    });
    console.log(this.state.roomName);
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

  acceptRequest = (teacher_id, student_id) => {
    var data = {
      teacher_id: teacher_id,
      student_id: student_id,
    };
    axios
      .post(`http://localhost:3001/modify/relationship`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        // this.setState({
        //   requests: auth,
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  startCall = (from_id, to_id) => {
    console.log("what");
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
        this.setState({
          roomName: "" + auth._id,
        });
        this.joinRoom();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    const { firstName, lastName, email, userId } = this.props.teacher.auth;
    axios
      .get(`http://localhost:3001/get/teacher/${userId}/requests`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        this.setState({
          requests: auth,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`http://localhost:3001/get/teacher/${userId}/students`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: "same-origin",
      })
      .then((response) => {
        var auth = response.data;
        console.log(auth);
        this.setState({
          students: auth,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(
        `http://localhost:3001/calls/${this.props.teacher.auth.userId}/subscribe`,
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
          incomingCallData: auth,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("http://localhost:3001/generatetoken/teacher", {
        withCredentials: "same-origin",
      })
      .then((results) => {
        console.log(results.data.token);
        var id = results.data.identity;
        var tokenGet = results.data.token;
        this.setState({ identity: id, token: tokenGet });
      });
  }
  render() {
    const { firstName, lastName, email, userId } = this.props.teacher.auth;
    const requestsMap =
      this.state.requests.length !== 0 ? (
        <div className="requests-grid">
          {this.state.requests.map((request) => (
            <RequestCard
              acceptRequest={this.acceptRequest}
              student_id={request.student_id}
              teacher_id={userId}
              key={request.student_id}
            />
          ))}
        </div>
      ) : (
        <div>
          <h4>No new requests.</h4>
        </div>
      );
    const studentsMap =
      this.state.students.length !== 0 ? (
        <div className="requests-grid">
          {this.state.students.map((student) => (
            <StudentCard
              student_id={student.student_id}
              teacher_id={userId}
              startCall={this.startCall}
              key={student.student_id}
            />
          ))}
        </div>
      ) : (
        <div>
          <h4>No students yet. Add some from the discover page!</h4>
        </div>
      );
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
      <div className="teacher-landing-main">
        <Fullscreen enabled={this.state.hasJoinedRoom}>
          <div className="video-container">{showLocalTrack}</div>
        </Fullscreen>
        <h1>Welcome Back, {firstName}</h1>
        <div className="incoming-requests-container">
          <div className="incoming-requests-header">
            <h1 className="incoming-requests-header">New Student Requests</h1>
          </div>
          {requestsMap}
        </div>
        <div className="teacher-students-container">
          <div className="teacher-students-header">
            <h1 className="teacher-students-text">My Students</h1>
          </div>
          {studentsMap}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { user, teacher } = state;
  return { user, teacher };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (teacher) => {
      dispatch(logoutTeacher(teacher));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherLanding);
