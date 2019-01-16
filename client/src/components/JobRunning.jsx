import React, { Component } from "react";
import { css } from "react-emotion";
import { BeatLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 10px auto;
  border-color: red;
`;

class Loading extends Component {
  render() {
    return (
      <div className="sweet-loading" style={{ textAlign: "center" }}>
        <BeatLoader
          className={override}
          sizeUnit={"px"}
          size={35}
          //color={"#444466"}
          loading={!this.props.jobComplete}
        />
      </div>
    );
  }
}

export default Loading;
