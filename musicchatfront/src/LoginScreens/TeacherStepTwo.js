import React from "react";
import { Spring, Trail } from "react-spring/renderprops";
import { Form, Button, TextArea, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class TeacherStepTwo extends React.Component {
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
              One more step
            </h1>
            <Spring
              from={{ opacity: 0, marginTop: -1000 }}
              to={{ opacity: 1, marginTop: 10 }}
            >
              {(props) => (
                <div style={{ props }}>
                  <Form style={{ margin: "20px" }}>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <Dropdown
                          label="Instrument"
                          placeholder="Instrument"
                          fluid
                          closeOnChange
                          search
                          selection
                          options={instruments}
                          onChange={this.props.onChangeInstrument}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field>
                      <TextArea
                        placeholder="Tell us more about your experience..."
                        label="Experience"
                        name="bio"
                        value={this.props.bio}
                        onChange={this.props.onChange}
                      />
                    </Form.Field>

                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#6470FF",
                        marginBottom: "10px",
                      }}
                      fluid
                      type="submit"
                      onClick={this.props.onSubmit}
                    >
                      Submit
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
              )}
            </Spring>
          </div>
        </div>
      </div>
    );
  }
}

const instruments = [
  { key: "default", text: "Instrument", value: "default" },
  { key: "accordion", text: "Accordion", value: "accordion" },
  { key: "bagpipe", text: "Bagpipe", value: "bagpipe" },
  { key: "banjo", text: "Banjo", value: "banjo" },
  { key: "bass guitar", text: "Bass Guitar", value: "bass guitar" },
  { key: "bassoon", text: "Bassoon", value: "bassoon" },
  { key: "bugle", text: "Bugle", value: "bugle" },
  { key: "cello", text: "Cello", value: "cello" },
  { key: "clarinet", text: "Clarinet", value: "clarinet" },
  { key: "flute", text: "Flute", value: "flute" },
  { key: "French horn", text: "French Horn", value: "French horn" },
  { key: "guitar", text: "Guitar", value: "guitar" },
  { key: "harp", text: "Harp", value: "harp" },
  { key: "mandolin", text: "Mandolin", value: "mandolin" },
  { key: "oboe", text: "Oboe", value: "oboe" },
  { key: "percussion", text: "Percussion", value: "percussion" },
  { key: "piano", text: "Piano", value: "piano" },
  { key: "organ", text: "Organ", value: "organ" },
  { key: "saxophone", text: "Saxophone", value: "saxophone" },
  { key: "trombone", text: "accordion", value: "accordion" },
  { key: "tuba", text: "Tuba", value: "tuba" },
  { key: "ukulele", text: "Ukulele", value: "ukulele" },
  { key: "viola", text: "Viola", value: "viola" },
  { key: "violin", text: "Violin", value: "violin" },
];
