import React, { Component } from "react";

class StatusBar extends Component {
  render() {
    return this.props.isOkay ? (
      <div style={{ width: "100%" }}>
        <p className="m-0 small">Looks Good.</p>
        <div
          style={{ width: "100%", height: "6px" }}
          className="bg-success align-bottom m-0"
        />
      </div>
    ) : (
      <div style={{ width: "100%" }}>
        <p className="m-0 text-danger small">{this.props.errorText}</p>
        <div
          style={{ width: "100%", height: "6px" }}
          className="bg-danger align-bottom m-0"
        />
      </div>
    );
  }
}

export default StatusBar;
