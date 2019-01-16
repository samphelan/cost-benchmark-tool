import React, { Component } from "react";
import Attributes from "./Attributes";
import EligibilityTypes from "./EligibilityTypes";

class CustomerOptions extends Component {
  render() {
    const options = [
      "Option 1: Customer File",
      "Option 2: Hierarchy File",
      "Option 3: Customer Attributes"
    ];
    const displayCustomerUpload =
      this.props.selectedOption === options[0] ? "block" : "none";
    const displayHierarchyUpload =
      this.props.selectedOption === options[1] ? "block" : "none";
    return (
      <div className="container p-0 m-0">
        <div className="row" style={{ textAlign: "left" }}>
          <div className="col">
            <label>
              <input
                type="radio"
                value={options[0]}
                checked={this.props.selectedOption === options[0]}
                onChange={this.props.onOptionChange}
                className="mr-1"
              />
              {options[0]}
            </label>
          </div>
        </div>

        <div
          className="row m-2 mb-3"
          style={{ textAlign: "left", display: displayCustomerUpload }}
        >
          <div className="col">
            <input
              type="file"
              ref={this.props.reference}
              onChange={this.props.onUpload}
              id="customer"
              className="inputfile"
            />
            <label className="btn btn-sm btn-primary mr-1" htmlFor="customer">
              Choose File
            </label>
            {this.props.customerFileName || "No file chosen"}
          </div>
        </div>

        <div className="row" style={{ textAlign: "left" }}>
          <div className="col">
            <label>
              <input
                type="radio"
                value={options[1]}
                checked={this.props.selectedOption === options[1]}
                onChange={this.props.onOptionChange}
                className="mr-1"
              />
              {options[1]}
            </label>
          </div>
        </div>

        <div
          className="row m-2 mb-3"
          style={{ textAlign: "left", display: displayHierarchyUpload }}
        >
          <div className="col">
            <div>
              <input
                type="file"
                ref={this.props.hierarchyReference}
                onChange={this.props.onUpload}
                id="hierarchy"
                className="inputfile"
              />
              <label
                className="btn btn-sm btn-primary mr-1"
                htmlFor="hierarchy"
              >
                Choose File
              </label>
              {this.props.hierarchyFileName || "No file chosen"}
            </div>
          </div>
        </div>

        <div className="row" style={{ textAlign: "left" }}>
          <div className="col">
            <label>
              <input
                type="radio"
                value={options[2]}
                checked={this.props.selectedOption === options[2]}
                onChange={this.props.onOptionChange}
                className="mr-1"
              />
              {options[2]}
            </label>
          </div>
        </div>
        {this.props.selectedOption === options[2] ? (
          <Attributes
            onAttributeTypeSelection={this.props.onAttributeTypeSelection}
            selectedAttributes={this.props.selectedAttributes}
            selectedAttributeValues={this.props.selectedAttributeValues}
            onSelectAllAttributes={this.props.onSelectAllAttributes}
            onDeselectAllAttributes={this.props.onDeselectAllAttributes}
          />
        ) : null}

        <div className="row" style={{ textAlign: "left" }}>
          <div className="col">
            <EligibilityTypes
              onSelectEligibilityType={this.props.onSelectEligibilityType}
              selectedEligibilityTypes={this.props.selectedEligibilityTypes}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerOptions;
