import React from "react";
import { Spring, Trail } from "react-spring/renderprops";
import { Form, Button, Checkbox } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class TeacherStepOne extends React.Component {
  render() {
    return (
      <div
        className="teacher-register-container"
        style={{ backgroundColor: "white" }}
      >
        <div className="left-container">
          <div
            className="form-container"
            style={{
              width: "90%",
              marginLeft: "30px",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                color: "#6470FF",
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              Register as a teacher
            </h1>

            <Form style={{ margin: "20px" }}>
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Input
                    label="First Name"
                    name="firstName"
                    value={this.props.firstName}
                    onChange={this.props.onChange}
                    placeholder="First Name"
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label="Last Name"
                    name="lastName"
                    value={this.props.lastName}
                    onChange={this.props.onChange}
                    placeholder="Last Name"
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <Form.Input
                  label="Email"
                  type="email"
                  name="email"
                  value={this.props.email}
                  onChange={this.props.onChange}
                  placeholder="example@email.com"
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  label="Password"
                  type="password"
                  name="password"
                  value={this.props.password}
                  onChange={this.props.onChange}
                  placeholder="Password"
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  label="Confirm Password"
                  name="passwordConf"
                  value={this.props.passwordConf}
                  onChange={this.props.onChange}
                  type="password"
                  placeholder="Confirm"
                />
              </Form.Field>
              <Form.Field>
                <Checkbox label="I agree to the Terms and Conditions" />
              </Form.Field>
              <Button
                style={{
                  color: "white",
                  backgroundColor: "#6470FF",
                  marginBottom: "10px",
                }}
                fluid
                type="submit"
                onClick={this.props.onNext}
              >
                Next
              </Button>
              <Link
                to="/"
                style={{
                  textAlign: "center",
                  color: "#6470FF",
                }}
              >
                Not a Teacher? Go back
              </Link>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
