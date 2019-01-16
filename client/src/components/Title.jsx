import React, { Component } from "react";

class Title extends Component {
  render() {
    return <h3 className="text-center">{this.props.title}</h3>;
  }
}

export default Title;
