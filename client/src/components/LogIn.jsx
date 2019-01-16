import React, { Component } from "react";

class LogIn extends Component {
  state = {};
  render() {
    return (
      <div
        className="container border rounded shadow p-4"
        style={{ width: "50%", overflow: "auto" }}
      >
        <form ref={this.props.reference} onSubmit={this.props.onLogin}>
          <div className="row mb-3">
            <div className="col text-center">
              Username:
              <br />
              <input
                ref={this.props.userNameRef}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col text-center">
              Password:
              <br />
              <input
                ref={this.props.passwordRef}
                type="password"
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col text-center">
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
            </div>
          </div>
        </form>
        <div
          className="row mb-3"
          style={{ display: this.props.wrongCredentials ? "block" : "none" }}
        >
          <div className="col text-center">
            <p className="text-danger">
              Username / Password Combination Not Found.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LogIn;
