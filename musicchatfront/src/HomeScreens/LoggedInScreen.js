import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {
    Redirect, 
    Link
} from "react-router-dom";
import axios from 'axios';
import LessonsScreen from '../VideoChatScreens/LessonsScreen';
import InfoScreen from './InfoScreen.js';
import LoggedOutScreen from './LoggedOutScreen.js'
import { connect } from 'react-redux';
import {logoutUser} from '../actions/logoutAction'
import PrimaryDashboard from '../DashboardScreens/PrimaryDashboardScreen.js'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

// Be sure to include styles at some point, probably during your bootstraping

class LoggedInScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toLoggedOut: false,
        }
    }

    handleLogout = () => {
        //192.168.1.18 is the one at home, change for different wifis, eventually heroku
        axios.get("http://localhost:3001/logout", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: "same-origin"
            //change the response so it sends json, then its working
        }).then((response) => {
            var auth = response.data
            this.props.logout("not authenticated");
            this.setState({
                toLoggedOut: true,
            });
            console.log("logged out");
        }).catch((error) => {
            console.error(error);
        });
    }
    render() {
        if (this.state.toLoggedOut === true) {
            return (
                <Router>
                    <Redirect to='/' />
                </Router>
            );
        }
        return (
            <Router>
                <div value = "mainDiv">
                    <Sidebar
                        as={Menu}
                        animation="push"
                        icon='labeled'
                        inverted
                        vertical
                        visible
                        width='thin'
                    >
                        <Menu.Item as={Link} to="/dashboard">
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item as={Link} to="/lessons">
                            <Icon name='gamepad' />
                            Join Lesson
                        </Menu.Item>
                        <Menu.Item onClick={this.handleLogout}>
                            <Icon name='camera' />
                            Logout
                        </Menu.Item>
                    </Sidebar>
            
                    <Sidebar.Pusher>
                        <Switch>
                            <Route exact path="/logout">
                                <LoggedOutScreen />
                            </Route>
                            <Route exact path="/">
                                <PrimaryDashboard />
                            </Route>
                            <Route exact path="/dashboard">
                                <PrimaryDashboard />
                            </Route>  
                            <Route exact path="/lessons">
                                <LessonsScreen />
                            </Route>
                        </Switch>
                    </Sidebar.Pusher>
                </div>
            </Router>
        );
    }
}
const mapStateToProps = (state) => {
    const { user } = state;
    return { user }
};
const mapDispatchToProps = dispatch => {
    return {
        logout: (user) => {
            dispatch(logoutUser(user));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInScreen);