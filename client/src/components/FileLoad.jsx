import React, { Component } from "react";
import { css } from "react-emotion";
import { BarLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 20px 0 0 0;
  border-color: red;
`;

class FileLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <div className="sweet-loading">
        <BarLoader
          className={override}
          sizeUnit={"px"}
          size={15}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default FileLoad;
