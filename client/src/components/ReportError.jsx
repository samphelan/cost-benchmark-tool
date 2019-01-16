import React, { Component } from "react";
import NavBar from "./NavBar";
import { Redirect } from "react-router-dom";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class ReportError extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedErrorType: "Incorrect data in output",
        descriptionText: "",
        user: {
          email: this.props.location ? this.props.location.state.user : null
        },
        userText: this.props.location ? this.props.location.state.user : null,
        jobIdText: this.props.location ? this.props.location.state.jobId : null,
        authenticated: null,
        submitted: false
      };
      this.checkAuthentication();
    }

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated }, async () => {
          if (this.state.authenticated === false) {
            this.login();
          }
          if (this.state.authenticated === true) {
            const user = await this.props.auth.getUser();
            console.log(user);
            this.setState({ user });
            this.setState({ userText: user.email });
          }
        });
      }
    };

    handleErrorTypeChange = e => {
      this.setState({ selectedErrorType: e.target.value });
    };

    handleUpload = e => {
      const urlName = e.target.id + "Url";
      const inputType = e.target.id;
      const data = new FormData();
      data.append("file", this[inputType].files[0]);

      fetch("/uploadFile/" + this.state.jobId + "/" + e.target.id, {
        method: "POST",
        body: data
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);
          this.setState({ [urlName]: responses.url });
        });
    };

    handleTyping = e => {
      this.setState({ [e.target.id]: e.target.value });
    };

    handleSubmit = e => {
      e.preventDefault();

      const data = new FormData();
      data.append("email", this.state.userText);
      data.append("jobId", this.state.jobIdText);
      data.append("problemType", this.state.selectedErrorType);
      data.append("description", this.state.descriptionText);

      fetch("/api/submitProblem", {
        method: "POST",
        body: data
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);
          this.setState({ submitted: true });
        });
    };

    render() {
      console.log(this.props);

      if (this.state.submitted) {
        return (
          <div className="container p-0 ml-auto mr-auto m-0">
            <div className="row m-0 p-0">
              <div className="col m-0 p-0">
                <NavBar
                  jobId={
                    this.props.location ? this.props.location.state.jobId : null
                  }
                  user={this.state.user.email}
                />
              </div>
            </div>
            <div className="row mt-5 text-center">
              <div className="col">
                Thank you. Your feedback has been received.
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="container p-0 ml-auto mr-auto m-0">
            <div className="row m-0 p-0">
              <div className="col m-0 p-0">
                <NavBar
                  jobId={
                    this.props.location ? this.props.location.state.jobId : null
                  }
                  user={this.state.user.email}
                />
              </div>
            </div>

            <div className="container w-75">
              <div className="row mt-3 mb-4">
                <div className="col text-center">
                  <h3
                    className="font-weight-bold"
                    style={{ fontSize: "1.4em" }}
                  >
                    Report a Problem
                  </h3>
                </div>
              </div>

              <form>
                <div className="row font-weight-bold mb-3">
                  <div className="col-sm-3">User Email:</div>

                  <div className="col-sm-9">
                    <input
                      id="userText"
                      type="text"
                      value={this.state.userText}
                      onChange={this.handleTyping}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>

                <div className="row font-weight-bold mb-3">
                  <div className="col-sm-3">Job ID:</div>

                  <div className="col-sm-9">
                    <input
                      id="jobIdText"
                      type="text"
                      value={this.state.jobIdText}
                      onChange={this.handleTyping}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-3 font-weight-bold">
                    Problem Type:{" "}
                  </div>
                  <div className="col-sm-9">
                    <select
                      className="m-0 p-0 form-control form-control-sm"
                      value={this.state.selectedErrorType}
                      onChange={this.handleErrorTypeChange}
                    >
                      {[
                        "Incorrect data in output",
                        "File does not download",
                        "Job does not complete",
                        "Other"
                      ].map(element => {
                        return (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="row mb-2 font-weight-bold">
                  <div className="col">Description:</div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <textarea
                      id="descriptionText"
                      className="form-control"
                      value={this.state.descriptionText}
                      rows={5}
                      onChange={this.handleTyping}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col text-center">
                    <button
                      type="submit"
                      onClick={this.handleSubmit}
                      className="btn btn-primary"
                      disabled={
                        this.state.userText === "" ||
                        this.state.jobIdText === "" ||
                        this.state.descriptionText === ""
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      }
    }
  }
);
