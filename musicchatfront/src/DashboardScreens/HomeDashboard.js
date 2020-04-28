import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import dummyImage from '../images/music-teacher.jpg';
import '../styles/HomeDashboard.css';

export class PrimaryDashboardScreen extends Component {
    constructor(props) {
        super(props);
      }

    render() {
        const { username, email, userId } = this.props.user.auth;
        return (
            <div className="dashboard-main">
                <div className="teachers-container">
                    <div className="dashboard-header">
                        <h1 className="teachers-header">My Teachers</h1>
                        <button className="schedule-button" >Schedule a lesson</button>
                    </div>
                    <div className="teachers-grid">
                        <Card style={{"text-align": "center"}}>
                            <h1 style={{color: "#6470FF"}}>Clarinet</h1>
                            <div className="card-profile" style={{display:"flex", margin: "0 auto"}}>
                                <img src={dummyImage} className="teacher-image"/>
                                <p className="teacher-name">Jeff Daves</p>
                            </div>
                            <hr style={{"width": "50%", margin: "0 auto", "marginTop": "15px", color: "#707070"}}/>
                            <h2 style={{"margin-top": "10px", "fontSize": "24px", "color": "#6470FF", "fontWeight": "bolder"}}>Next lesson</h2>
                            <div className="next-lesson-div">
                                <p style={{"fontSize": "18px", "color": "black", }}>12 July 2020</p>
                            </div>
                            <div className="view-homework-div">
                                <p style={{"fontSize": "18px", "margin": "0 auto"}}>View Homework</p>
                            </div>
                        </Card>
                        <Card style={{"text-align": "center"}}>
                            <h1 style={{color: "#6470FF"}}>Clarinet</h1>
                            <div className="card-profile" style={{display:"flex", margin: "0 auto"}}>
                                <img src={dummyImage} className="teacher-image"/>
                                <p className="teacher-name">Jeff Daves</p>
                            </div>
                            <hr style={{"width": "50%", margin: "0 auto", "marginTop": "15px", color: "#707070"}}/>
                            <h2 style={{"margin-top": "10px", "fontSize": "24px", "color": "#6470FF", "fontWeight": "bolder"}}>Next lesson</h2>
                            <div className="next-lesson-div">
                                <p style={{"fontSize": "18px", "color": "black", }}>12 July 2020</p>
                            </div>
                            <div className="view-homework-div">
                                <p style={{"fontSize": "18px", "margin": "0 auto"}}>View Homework</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="pieces-container">
                    <h1 className="pieces-header">My Pieces</h1>
                    <div className="pieces-grid">
                        <Card >
                            <div className="piece-flex" style={{"overflow": "hidden"}}>
                                <img src={dummyImage} style={{height: "75px", width: "80px"}}/>
                                <div style={{textAlign: "center"}}>
                                    <h2 className="piece-title">Ballade No. 1</h2>
                                    <p className="piece-composer"> Frederic Chopin</p>
                                </div>
                            </div>
                        </Card>
                        <Card >
                            <div className="piece-flex" style={{"overflow": "hidden"}}>
                                <img src={dummyImage} style={{height: "75px", width: "80px",}}/>
                                <div style={{textAlign: "center"}}> 
                                    <h2 className="piece-title">Ballade No. 1</h2>
                                    <p className="piece-composer"> Frederic Chopin</p>
                                </div>
                            </div>
                        </Card>
                        <Card >
                            <div className="piece-flex" style={{"overflow": "hidden"}}>
                                <img src={dummyImage} style={{height: "75px", width: "80px"}}/>
                                <div style={{textAlign: "center"}}>
                                    <h2 className="piece-title">Ballade No. 1</h2>
                                    <p className="piece-composer"> Frederic Chopin</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    const { user } = state;
    return { user };
};

const mapDispatchToProps = {
    
};

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryDashboardScreen);