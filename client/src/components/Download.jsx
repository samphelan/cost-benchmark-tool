import React, { Component } from "react";

class Download extends Component {
  state = {};
  render() {
    const reportList = [
      "Material SPA & Stock Report",
      "Customer Report",
      "Material Agreement Report Condensed",
      "Material Agreement Report Long Version"
    ];
    return (
      <div
        className="container border rounded shadow p-3 ml-auto mr-auto mt-4"
        style={{ width: "70%", minWidth: "250px" }}
      >
        {this.props.selectedReports.split("").map((character, index) => {
          return character === "1" ? (
            <div key={index + 1} className="row">
              <div
                key={index + 2}
                className="col-6 border-right"
                style={{ textAlign: "right" }}
              >
                {reportList[index]}
              </div>

              <div
                key={index + 3}
                className="col-6"
                style={{ textAlign: "left" }}
              >
                <button
                  key={index + 4}
                  className="link-button"
                  value={index + 1}
                  onClick={this.props.onDownload}
                >
                  Download
                </button>
              </div>
            </div>
          ) : null;
        })}
      </div>
    );
  }
}

export default Download;
