import React, { Component } from "react";

class Checkbox extends Component {
  render() {
    return (
      <div>
        <input
          value={this.props.text}
          type="checkbox"
          className="mr-1"
          onChange={this.props.onSelection}
        />
        {this.props.text}
      </div>
    );
  }
}

export default Checkbox;
