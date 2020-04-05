import React from 'react'
import '../styles/InfoScreen.css'

export default class InfoScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="container-info">
                <div className="background-tutor-image"></div>
                <div className="info-image-header">
                    <h1 className="info-title">MusicChat</h1>
                    <p className="info-subtitle">Making online music lessons easier</p>
                </div>
            </div>
        );
    }
}