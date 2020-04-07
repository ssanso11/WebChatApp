import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Icon, Image, Menu, Segment, Grid, Container } from 'semantic-ui-react'
import '../styles/PrimaryDashboard.css'

export class PrimaryDashboardScreen extends Component {
    constructor(props) {
        super(props);
      }

    render() {
        const { username, email, userId } = this.props.user.auth;
        return (
            <Container fluid>
                <Grid columns='three' divided>
                    <Grid.Row>
                        <Grid.Column><h2>Username: {username}</h2></Grid.Column>
                        <Grid.Column><h2>Email: {email}</h2></Grid.Column>
                        <Grid.Column><h2>ID: {userId}</h2></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
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
