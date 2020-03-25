import React from 'react';
import axios from 'axios';
import {
    Redirect
} from "react-router-dom";
import { connect } from 'react-redux';
import {getUser} from '../actions/userAction';

class Login extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailRegister = this.handleEmailRegister.bind(this);
        this.handlePasswordRegister = this.handlePasswordRegister.bind(this);
        this.handlePasswordConf = this.handlePasswordConf.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
    }

    getInitialState = () => ({
        /* state props */
        emailLogin: "", 
        passwordLogin: "", 
        emailRegister:"", 
        passwordRegister: "", 
        passwordConf: "", 
        usernameRegister: "", 
        isAuthenticated: false,
    })

    handleSubmit(event) {
        event.preventDefault();
        this.setState(this.getInitialState());
        const email = this.state.emailLogin 
        const password = this.state.passwordLogin;
        var data = {"logemail": email, "logpassword": password};
        //fetch login 
        axios.post("http://localhost:3001/login", data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: "same-origin"
            //change the response so it sends json, then its working
        }).then((response) => {
            var auth = response.data;
            console.log(auth.userId)
            if(auth.userId != null)
            {
                //alert("Signed in as " + auth.username);
                //this.props.add({auth});
                this.setState({
                    isAuthenticated: true,
                });

            }
        })
        .catch((error) => {
            console.error(error);
        }); 
        
    }
    handleSubmitRegister(event) {
        event.preventDefault();
        this.setState(this.getInitialState());
        const email = this.state.emailRegister;
        const username = this.state.usernameRegister;
        const password = this.state.passwordRegister;
        const passwordConf = this.state.passwordConf;
        var data = {"email": email, "username": username, "password": password, "passwordConf": passwordConf};
        axios.post("http://localhost:3001/signup", data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: "same-origin"
            //change the response so it sends json, then its working
        }).then((response) => {
            var auth = response.data;
            console.log(auth.userId)
            if(auth.userId != null)
            {
                alert("Created user " + auth.username);
                this.setState({
                    isAuthenticated: true,
                });
            }
        })
        .catch((error) => {
            console.error(error);
        }); 
    }
    
    handleEmail(event) {
        this.setState({emailLogin: event.target.value});
    }
    handlePassword(event) {
        this.setState({passwordLogin: event.target.value});
    }
    handleEmailRegister(event) {
        this.setState({emailRegister: event.target.value});
    }
    handlePasswordRegister(event) {
        this.setState({passwordRegister: event.target.value});
    }
    handlePasswordConf(event) {
        this.setState({passwordConf: event.target.value});
    }
    handleUsername(event) {
        this.setState({usernameRegister: event.target.value});
    }

    render(){
        if (this.state.isAuthenticated === true) {
            return <Redirect to='/lessons' />
        }
        return(
        <div className="App">
            <div>
                <h1>Login</h1>
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Email:
                        <input type="text" value={this.state.emailLogin} onChange={this.handleEmail} />
                    </label>
                    <label>
                        Password:
                        <input type="text" value={this.state.passwordLogin} onChange={this.handlePassword} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div>
                <h1>Register</h1>
                <form onSubmit = {this.handleSubmitRegister}>
                    <label>
                        Username:
                        <input type="text" value={this.state.usernameRegister} onChange={this.handleUsername} />
                    </label>
                    <label>
                        Email:
                        <input type="text" value={this.state.emailRegister} onChange={this.handleEmailRegister} />
                    </label>
                    <label>
                        Password:
                        <input type="text" value={this.state.passwordRegister} onChange={this.handlePasswordRegister} />
                    </label>
                    <label>
                        Confirm Password:
                        <input type="text" value={this.state.passwordConf} onChange={this.handlePasswordConf} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        add: (user) => {
            dispatch(getUser(user))
        }
    }
}

export default connect(null, mapDispatchToProps)(Login);
