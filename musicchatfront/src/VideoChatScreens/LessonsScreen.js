import React from 'react';
import axios from 'axios';
import Video from 'twilio-video';
import { Button, Input, Icon, Card } from 'semantic-ui-react'


export default class LessonScreens extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();

        this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.detachTracks = this.detachTracks.bind(this);
        this.detachParticipantTracks =this.detachParticipantTracks.bind(this);
        this.participantConnected = this.participantConnected.bind(this);
    }

    getInitialState = () => ({
        /* state props */
        identity: null,
        token: "",
        previewTracks: null, 
        roomName: "", 
        localMediaAvailable: false, /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */
        hasJoinedRoom: false,
        activeRoom: null // Track the current active room
    })

    componentDidMount() {
        axios.get("http://localhost:3001/generatetoken", {
            withCredentials: "same-origin"
        }).then(results => {
            console.log(results.data.token)
            var id = results.data.identity;
            var tokenGet = results.data.token;
            this.setState({identity: id, token: tokenGet})
        }); 
    }
    handleRoomNameChange(event) {
        this.setState({roomName:event.target.value})
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
        if(this.state.previewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }
        //connect to a video, callback is roomJoined
        Video.connect(this.state.token, connectOptions).then(room => {
                this.roomJoined(room)
            }, error => {
                console.log(error);
                alert('Could not connect to Twilio: ' + error.message);
            
        });
    }

    roomJoined(room) {
        //set state
        console.log("joined");
        this.setState({
            hasJoinedRoom: true, 
            activeRoom: room, 
            localMediaAvailable: true,
            sidebar: false,
        });
        // Attach LocalParticipant's tracks to the DOM, if not already attached.
        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector('video')) {
            this.attachTracks(this.getTracks(room.localParticipant), previewContainer);
        }

        //for users joining room
        // Attach the Tracks of the room's participants.
        const localParticipant = room.localParticipant;
        console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);
        console.log(room.participants.size)

        room.participants.forEach(this.participantConnected);
    
        // Participant joining room
        room.on('participantConnected', this.participantConnected);
        
    
        // Attach participant’s tracks to DOM when they add a track
        room.on('trackAdded', (track, participant) => {
            console.log("here we go")
            console.log(participant.identity + ' added track: ' + track.kind);
            var previewContainer = this.refs.remoteMedia;
            this.attachTracks([track], previewContainer);
        });
    
        // Detach participant’s track from DOM when they remove a track.
        room.on('trackRemoved', (track, participant) => {
            this.log(participant.identity + ' removed track: ' + track.kind);
            this.detachTracks([track]);
        });
    
        // Detach all participant’s track when they leave a room.
        room.on('participantDisconnected', participant => {
            console.log("Participant '" + participant.identity + "' left the room");
            this.detachParticipantTracks(participant);
        });
    
        // Once the local participant leaves the room, detach the Tracks
        // of all other participants, including that of the LocalParticipant.
        room.on('disconnected', () => {
            if (this.state.previewTracks) {
                this.state.previewTracks.forEach(track => {
                    track.stop();
                });
            }
            this.detachParticipantTracks(room.localParticipant);
            room.participants.forEach(this.detachParticipantTracks);
            this.setState({ activeRoom: null, hasJoinedRoom: false, localMediaAvailable: false });
        });
    }

    participantConnected(participant) {
        console.log('Participant "%s" connected', participant.identity);

        const div = document.createElement('div');
        div.id = participant.sid;
        //div.innerText = participant.identity;

        participant.on('trackSubscribed', track => {
            div.appendChild(track.attach());
        });
        participant.on('trackUnsubscribed', track => {
            track.detach().forEach(element => element.remove());
        });

        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
                div.appendChild(publication.track.attach());
            }
        });

        document.body.appendChild(div);
    }

    // Attach the Tracks to the DOM.
    attachTracks(tracks, container) {
        tracks.forEach(track => {
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
        return Array.from(participant.tracks.values()).filter(function(publication) {
            return publication.track;
        }).map(function(publication) {
            return publication.track;
        });
    }

    //REMOTE MEDIA
    detachTracks(tracks) {
        tracks.forEach(track => {
            track.detach().forEach(detachedElement => {
                detachedElement.remove();
            });
        });
    }
    detachParticipantTracks(participant) {
        var tracks = this.getTracks(participant);
        this.detachTracks(tracks);
    }

    render() {
        let showLocalTrack = this.state.localMediaAvailable ? (
            <div className="flex-item"><div ref="localMedia" /> </div>) : '';

        let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
        <Button onClick={this.leaveRoom}>Leave Room</Button>) : (
        <Button onClick={this.joinRoom}>Join Room</Button>);

        return(
            <Card>
                <div>
                    {showLocalTrack}
                        <div>
                            <Input id = "room-text" onChange = {this.handleRoomNameChange}/>
                            <br></br>
                            {joinOrLeaveRoomButton}
                        </div>
                        <div ref="remoteMedia">

                        </div>
                </div>
            </Card>
            
        );
    }
}