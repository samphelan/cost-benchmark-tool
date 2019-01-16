import React, { Component } from "react";
import { Link } from "react-router-dom";

class Logo extends Component {
  state = {};
  render() {
    return (
      <div className="container m-0 p-0">
        <div className="row">
          <div className="col">
            <Link to="/">
              <img
                src={require("../logo.jpg")}
                alt="Graybar Logo"
                height="130px"
                className="m-0"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Logo;
