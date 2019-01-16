import React, { Component } from "react";

class Submit extends Component {
  render() {
    return (
      <input
        type="submit"
        className="btn btn-primary"
        value="Submit"
        onClick={this.props.onSubmitJob}
        disabled={!this.props.isOkay}
        ref={this.props.reference}
      />
    );
  }
}

export default Submit;
