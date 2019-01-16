import React, { Component } from "react";

class Attribute extends Component {
  state = {
    options: [],
    displayValue: "none"
  };

  componentDidMount() {
    const attributeUrl = "/api/attributes/" + this.props.value;

    fetch(attributeUrl, {
      method: "GET"
    })
      .then(responses => responses.json())
      .then(responses => {
        const outputList = responses.map(responseData => {
          return responseData.value;
        });
        this.setState({ options: outputList });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    console.log(this.props.attributeSelected);

    return (
      <div>
        <input
          type="checkbox"
          value={this.props.value}
          onChange={this.props.onAttributeTypeSelection}
          id="header"
        />
        <span className="ml-1" style={{ fontSize: ".9em" }}>
          {this.props.name}
        </span>

        <div
          style={{
            fontSize: ".8em",
            display: this.props.attributeSelected ? "block" : "none"
          }}
          className="mt-2"
        >
          <button
            id={this.props.value}
            className="link-button ml-3"
            key="all"
            onClick={this.props.onSelectAllAttributes}
          >
            All
          </button>
          <button
            id={this.props.value}
            className="link-button ml-2"
            key="none"
            onClick={this.props.onDeselectAllAttributes}
          >
            None
          </button>
        </div>
        <div
          style={{
            height: "140px",
            overflow: "auto",
            display: this.props.attributeSelected ? "block" : "none",
            fontSize: ".8em"
          }}
          className="border p-2 shadow-sm m-2 ml-3"
        >
          {this.state.options.map(option => {
            return (
              <div key={option}>
                <input
                  key={option}
                  type="checkbox"
                  value={option}
                  className="mr-1"
                  onChange={this.props.onAttributeTypeSelection}
                  id={this.props.value}
                  checked={this.props.selectedAttributeValues.includes(
                    `${this.props.value}:${option}`
                  )}
                />
                {option}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Attribute;
