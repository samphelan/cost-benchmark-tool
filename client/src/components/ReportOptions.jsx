import React, { Component } from "react";
import Checkbox from "./Checkbox";

class ReportOptions extends Component {
  state = {};
  render() {
    return (
      <div className="container p-0 m-0">
        <div className="row">
          <div className="col">
            <Checkbox
              text="Material SPA & Stock Report"
              onSelection={this.props.onSelection}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Checkbox
              text="Customer Report"
              onSelection={this.props.onSelection}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Checkbox
              text="Material Agreement Report Condensed"
              onSelection={this.props.onSelection}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Checkbox
              text="Material Agreement Report Long Version"
              onSelection={this.props.onSelection}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ReportOptions;
