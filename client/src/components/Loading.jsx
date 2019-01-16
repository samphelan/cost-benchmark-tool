import React, { Component } from "react";
import { css } from "react-emotion";
import { RotateLoader } from "react-spinners";

/*
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
*/

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <div className="sweet-loading">
        <RotateLoader
          //className={override}
          sizeUnit={"px"}
          size={15}
          //color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default Loading;
