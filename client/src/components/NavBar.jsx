import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class NavBar extends Component {
    state = {};

    logout = async () => {
      this.props.auth.logout("/");
    };

    render() {
      return (
        <div className="container p-0 m-0">
          <div className="row m-0 p-0">
            <div className="col m-0 p-0">
              <Logo />
            </div>
            <div className="col text-right mt-auto mb-auto p-0">
              <Link
                to={{
                  pathname: "/user",
                  state: { jobId: this.props.jobId, user: this.props.user }
                }}
                className="font-weight-bold"
                style={{ fontSize: ".9em", color: "#888888" }}
              >
                {this.props.user}
              </Link>
              <br />
              <button
                className="link-button"
                style={{ fontSize: ".9em", color: "#888888" }}
                onClick={this.logout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="row border-top border-bottom pt-4 pb-4 mt-3 mb-3">
            <div className="col">
              <h5
                className="font-weight-bold"
                style={{ fontSize: ".9em", color: "#888888" }}
              >
                Job ID: {this.props.jobId}
              </h5>
            </div>

            <div className="col text-right">
              <Link
                to={{
                  pathname: "/report-error",
                  state: { jobId: this.props.jobId, user: this.props.user }
                }}
                className="font-weight-bold"
                style={{ fontSize: ".9em", color: "#888888" }}
              >
                Report a Problem
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
);
