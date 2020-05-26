import React from "react";
import axios from "axios";
import Video from "twilio-video";
import { Button, Input, Icon, Card } from "semantic-ui-react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import "react-pdf/dist/Page/AnnotationLayer.css";
import dummyMusic from "../images/dummy-pdf.pdf";
import "../styles/LessonsScreen.css";
import { connect } from "react-redux";
import AnnotatePiece from "./AnnotatePiece.js";
import Fullscreen from "react-full-screen";
import { Spring, animated } from "react-spring/renderprops";

class LessonScreens extends React.Component {
  constructor(props) {
    super(props);

    this.localMedia = React.createRef();
    this.remoteMedia = React.createRef();
    this.participantDiv = React.createRef();

    this.state = this.getInitialState();

    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
    this.participantConnected = this.participantConnected.bind(this);
  }

  getInitialState = () => ({
    /* state props */
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
    axios
      .get("http://localhost:3001/generatetoken", {
        withCredentials: "same-origin",
      })
      .then((results) => {
        console.log(results.data.token);
        var id = results.data.identity;
        var tokenGet = results.data.token;
        this.setState({ identity: id, token: tokenGet });
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
        this.setState({
          pieces: response.data.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleRoomNameChange(event) {
    this.setState({ roomName: event.target.value });
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

  showPiece = () => {
    this.setState({
      annotateActive: true,
    });
  };
  render() {
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
          <button className="annotate" onClick={this.showPiece}></button>
          <button className="button1" onClick={this.leaveRoom}></button>
          <button className="button2"></button>
        </div>
      </div>
    ) : (
      //   <div className="flex-item">
      //     {/* <Button className="hangup" onClick={this.leaveRoom}>
      //       Leave Room
      //     </Button> */}
      //     <div ref="localMedia" />
      //     <div className="remote-div">
      //       <div ref="remoteMedia"></div>
      //     </div>
      //   </div>
      ""
    );

    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      ""
    ) : (
      <div className="join-room-div">
        <Input id="room-text" onChange={this.handleRoomNameChange} />
        <Button onClick={this.joinRoom}>Join Room</Button>
      </div>
    );

    let annotatePiece = this.state.annotateActive ? (
      <AnnotatePiece pieceUrl={this.state.pieces} />
    ) : (
      ""
    );
    return (
      <div className="join-lesson-container">
        <Fullscreen enabled={this.state.hasJoinedRoom}>
          <div className="video-container">
            {showLocalTrack}
            <div>{joinOrLeaveRoomButton}</div>
          </div>
          <div>
            {/* eventually add draw feature so teacher can annotate music */}
            {annotatePiece}
          </div>
        </Fullscreen>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreens);
