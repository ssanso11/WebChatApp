import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { 
    Navbar, 
    Nav, 
    NavDropdown, 
} from "react-bootstrap";
import {
    Redirect
} from "react-router-dom";
import axios from 'axios';
import LessonsScreen from '../VideoChatScreens/LessonsScreen';
import InfoScreen from './InfoScreen.js';
import LoggedOutScreen from './LoggedOutScreen.js'
import { connect } from 'react-redux';
import {logoutUser} from '../actions/logoutAction'

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
                    <Navbar sticky="top" bg="Spring-Wood" className="nav-bar">
                    <Navbar.Brand href="/home">MusicChat</Navbar.Brand>
                    <Navbar.Toggle aria-controls="first-navbar-nav" />
                    <Navbar.Collapse id="first-navbar-nav">
                        <Nav className = "mrAuto">
                        <Nav.Link href="/lessons">Dashboard</Nav.Link>
                        <Nav.Link href="/lessons">Calender</Nav.Link>
                        <Nav.Link href="#" onClick={this.handleLogout}>Logout</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">If</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">We</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Want</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    </Navbar>
                    <Switch>
                        <Route exact path="/logout">
                            <LoggedOutScreen />
                        </Route>
                        <Route exact path="/">
                            <InfoScreen />
                        </Route>
                        <Route exact path="/home">
                            <InfoScreen />
                        </Route>  
                        <Route exact path="/lessons">
                            <LessonsScreen />
                        </Route>
                    </Switch>
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