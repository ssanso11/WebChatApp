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
            <Container>
                <Grid columns='three' divided>
                    <Grid.Row>
                        <Grid.Column><h1>{username}</h1></Grid.Column>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column><h1>{email}</h1></Grid.Column>
                        <Grid.Column></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column><h1>{userId}</h1></Grid.Column>
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
