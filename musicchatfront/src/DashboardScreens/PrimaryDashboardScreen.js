import React from 'react'
import '../styles/PrimaryDashboard.css'

export default class InfoScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="container-dash">
                <h1 className="info-title">Dashboard</h1>
            </div>
        );
    }
}