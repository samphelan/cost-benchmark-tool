import React, { Component } from "react";

class Timer extends Component {
  render() {
    return (
      <React.Fragment>
        <h4 className="p-0 m-0 font-weight-bold">
          {(Math.floor(this.props.timeElapsed / 60) + "").padStart(2, "0")}:
          {((this.props.timeElapsed % 60) + "").padStart(2, "0")}
        </h4>
        <br />
        <h5 className="mt-3">
          Do not leave this page until you have downloaded the job output to
          your computer.
        </h5>
      </React.Fragment>
    );
  }
}

export default Timer;
