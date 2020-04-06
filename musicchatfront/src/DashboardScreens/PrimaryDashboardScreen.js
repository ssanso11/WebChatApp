import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/PrimaryDashboard.css'

export class PrimaryDashboardScreen extends Component {
    constructor(props) {
        super(props);
      }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <h2>Welcome {this.props.user.auth.username}!</h2>
                <ul>{this.props.user.auth.email}</ul>
                <ul>{this.props.user.auth.userId}</ul>
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
