import React, { Component } from "react";
import Attribute from "./Attribute";

class Attributes extends Component {
  render() {
    const attributeTypes = [
      { value: "vertical_market", name: "Vertical Market" },
      { value: "customer_market", name: "Customer Market" },
      { value: "customer_submarket", name: "Customer Submarket" },
      { value: "cot", name: "Class of Trade" },
      { value: "district", name: "District" },
      { value: "zone", name: "Zone" },
      { value: "sales_office", name: "Sales Office" }
    ];
    return (
      <div className="ml-2">
        {attributeTypes.map(attribute => {
          return (
            <Attribute
              key={attribute.value}
              value={attribute.value}
              name={attribute.name}
              onAttributeTypeSelection={this.props.onAttributeTypeSelection}
              attributeSelected={this.props.selectedAttributes.includes(
                attribute.value
              )}
              selectedAttributeValues={this.props.selectedAttributeValues}
              onSelectAllAttributes={this.props.onSelectAllAttributes}
              onDeselectAllAttributes={this.props.onDeselectAllAttributes}
              checked={this.props.selectedAttributes.includes(attribute)}
            />
          );
        })}
      </div>
    );
  }
}

export default Attributes;
