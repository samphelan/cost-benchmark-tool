import React, { Component } from "react";

class JobStatus extends Component {
  render() {
    return (
      <h4 style={{ fontWeight: "bold" }}>
        Job Status : {this.props.jobStatus}
      </h4>
    );
  }
}

export default JobStatus;
