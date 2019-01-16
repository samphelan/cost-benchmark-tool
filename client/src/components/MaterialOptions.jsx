import React, { Component } from "react";

class MaterialOptions extends Component {
  state = {};
  render() {
    return (
      <div>
        <input
          type="file"
          ref={this.props.reference}
          onChange={this.props.onUpload}
          id="material"
          className="inputfile"
        />
        <label className="btn btn-sm btn-primary mr-1" htmlFor="material">
          Choose File
        </label>
        {this.props.materialFileName || "No file chosen"}
      </div>
    );
  }
}

export default MaterialOptions;
