import React, { Component } from "react";

class EligibilityTypes extends Component {
  state = { headerIsSelected: false };

  handleHeaderSelection = changeEvent => {
    if (this.state.headerIsSelected === true) {
      this.setState({ headerIsSelected: false });
    } else {
      this.setState({ headerIsSelected: true });
    }
  };
  render() {
    const types = ["Customer", "Hierarchy", "COT/District", "COT/Sales Office"];
    return (
      <div className="container m-0 p-0">
        <div className="row mb-2">
          <div className="col">
            <input
              type="checkbox"
              className="mr-1"
              onChange={this.handleHeaderSelection}
              checked={this.state.headerIsSelected}
            />
            Select Eligibility Types (Optional)
          </div>
        </div>
        {types.map(type => {
          return (
            <div
              className="row ml-1"
              key={type}
              style={{
                display: this.state.headerIsSelected ? "block" : "none"
              }}
            >
              <div className="col" key={type} style={{ fontSize: ".8em" }}>
                <input
                  type="checkbox"
                  value={type}
                  className="mr-1"
                  onChange={this.props.onSelectEligibilityType}
                  key={type}
                  checked={this.props.selectedEligibilityTypes.includes(type)}
                />
                {type}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default EligibilityTypes;
