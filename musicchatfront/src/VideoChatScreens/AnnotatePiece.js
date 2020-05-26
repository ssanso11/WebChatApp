import React from "react";
import io from "socket.io-client";
import Immutable from "immutable";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import "../styles/AnnotatePiece.css";
let socket;
export default class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false,
      showTextEdit: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    socket = io.connect("http://localhost:3001");
    socket.on("mouseMoved", (point) => {
      console.log("received mouse moved");
      var xy = new Immutable.Map({
        x: point.x,
        y: point.y,
      });
      this.setState((prevState) => ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], (line) =>
          line.push(xy)
        ),
      }));
    });
    socket.on("mouseDown", (point) => {
      console.log("received mouse down");
      var xy = new Immutable.Map({
        x: point.x,
        y: point.y,
      });
      this.setState((prevState) => ({
        lines: prevState.lines.push(new Immutable.List([xy])),
        isDrawing: true,
      }));
    });
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    console.log(mouseEvent);
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    socket.emit("mouseDown", point);
    this.setState((prevState) => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true,
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    socket.emit("mouseMoved", point);
    console.log("point: " + point);
    this.setState((prevState) => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], (line) =>
        line.push(point)
      ),
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }
  onDoubleClick = (e) => {
    console.log("yay " + e.clientX);
    this.setState({
      showTextEdit: true,
    });
  };
  render() {
    return (
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onDoubleClick={this.onDoubleClick}
      >
        <Document file="https://imslp.simssa.ca/files/imglnks/usimg/b/b7/IMSLP13791-Weberclar2clar.pdf">
          <Page pageNumber={1} width={900} />
        </Document>
        <Drawing className="canvas" lines={this.state.lines}></Drawing>
      </div>
    );
  }
}

function Drawing({ lines }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
      {/* {lines.map((line, index) => (
        <AddText key={(index + 1) * 10} line={line} />
      ))} */}
    </svg>
  );
}

function DrawingLine({ line }) {
  const pathData =
    "M " +
    line
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");
  return <path className="path" d={pathData} />;
}
//attempt for text, but not essential so will work on later
// function AddText({ line }) {
//   // const pathData =
//   //   "M " +
//   //   line
//   //     .map((p) => {
//   //       return `${p.get("x")} ${p.get("y")}`;
//   //     })
//   //     .join(" L ");
//   console.log("text " + line.get(0));
//   return (
//     <text
//       className="text"
//       x={line.get(0).get("x")}
//       y={line.get(0).get("y")}
//       fill="red"
//     >
//       This is a bad idea
//     </text>
//   );
// }
