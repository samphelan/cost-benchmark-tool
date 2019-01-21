import React, { Component } from "react";
import "../App.css";
import CustomerOptions from "./CustomerOptions";
import MaterialOptions from "./MaterialOptions";
import Title from "./Title";
import ReportOptions from "./ReportOptions";
import Submit from "./Submit";
import StatusBar from "./StatusBar";
import NavBar from "./NavBar";
import PageLoad from "./PageLoad";
import { Redirect } from "react-router-dom";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class JobInputForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        submitted: false,
        selectedCustomerOption: "Option 1: Customer File",
        selectedReports: [],
        customerListUploaded: false,
        hierarchyListUploaded: false,
        materialListUploaded: false,
        customerUrl: "",
        hierarchyUrl: "",
        materialUrl: "",
        isSubmittable: false,
        selectedAttributes: [],
        selectedAttributeValues: [],
        selectedEligibilityTypes: [
          "Customer",
          "Hierarchy",
          "COT/District",
          "COT/Sales Office"
        ],
        jobId: "",
        jobName: "",
        authenticated: null,
        user: ""
      };
    }

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated();
      const user = await this.props.auth.getUser();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
        this.setState({ user });
      }
    };

    async componentDidUpdate() {
      this.checkAuthentication();
    }

    componentDidMount() {
      const datetime = Date.now();
      this.setState({ jobId: datetime });
      this.setState({ jobName: datetime });

      const attributes = [
        "vertical_market",
        "customer_market",
        "customer_submarket",
        "cot",
        "district",
        "sales_office",
        "zone"
      ];

      const code = window.location.search;

      console.log(code);

      attributes.map(attribute => {
        console.log(attribute);

        const attributeUrl = "/api/attributes/" + attribute;

        fetch(attributeUrl, {
          method: "GET"
        })
          .then(responses => responses.json())
          .then(responses => {
            let outputList = responses.map(responseData => {
              return `${attribute}:${responseData.value}`;
            });
            const currentList = this.state.selectedAttributeValues;

            this.setState({
              selectedAttributeValues: [...currentList, ...outputList]
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }

    handleOptionChange = changeEvent => {
      this.setState(
        {
          selectedCustomerOption: changeEvent.target.value,
          selectedAttributes: []
        },
        this.updateIsSubmittable
      );
    };

    handleEligibilityTypeSelection = changeEvent => {
      const eligibilityType = changeEvent.target.value;
      console.log(eligibilityType);
      const currentList = this.state.selectedEligibilityTypes;
      if (currentList.includes(eligibilityType)) {
        const index = currentList.indexOf(eligibilityType);
        currentList.splice(index, 1);
      } else {
        currentList.push(eligibilityType);
      }
      this.setState({ selectedEligibilityTypes: currentList });
      console.log(this.state.selectedEligibilityTypes);
    };

    handleAttributeSelection = changeEvent => {
      const attributeName = changeEvent.target.value;
      const attributeType = changeEvent.target.id;
      const isAttributeHeader =
        changeEvent.target.id === "header" ? true : false;
      let newList = [];
      if (isAttributeHeader) {
        newList = this.state.selectedAttributes;
      } else {
        newList = this.state.selectedAttributeValues;
      }

      if (changeEvent.target.checked) {
        if (isAttributeHeader) {
          newList.push(attributeName);
          this.setState({ selectedAttributes: newList });
        } else {
          newList.push(`${attributeType}:${attributeName}`);
          this.setState({ selectedAttributeValues: newList });
        }
      } else {
        if (isAttributeHeader) {
          const index = newList.indexOf(attributeName);
          newList.splice(index, 1);
          this.setState({ selectedAttributes: newList });
        } else {
          const index = newList.indexOf(`${attributeType}:${attributeName}`);
          newList.splice(index, 1);
          this.setState({ selectedAttributeValues: newList });
        }
      }
      console.log(this.state.selectedAttributeValues);
    };

    handleSelectAllAttributes = changeEvent => {
      const attributeName = changeEvent.target.id;
      console.log(attributeName);

      const attributeUrl = "/api/attributes/" + attributeName;

      fetch(attributeUrl, {
        method: "GET"
      })
        .then(responses => responses.json())
        .then(responses => {
          let outputList = responses.map(responseData => {
            return `${attributeName}:${responseData.value}`;
          });
          const currentList = this.state.selectedAttributeValues;

          this.setState({
            selectedAttributeValues: merge_array(currentList, outputList)
          });
        })
        .catch(err => {
          console.log(err);
        });
      function merge_array(array1, array2) {
        const result_array = [];
        const arr = [...array1, ...array2];
        let len = arr.length;
        let assoc = {};

        while (len--) {
          const item = arr[len];

          if (!assoc[item]) {
            result_array.unshift(item);
            assoc[item] = true;
          }
        }

        return result_array;
      }
    };

    handleDeselectAllAttributes = changeEvent => {
      const attributeName = changeEvent.target.id;
      console.log(attributeName);
      const currentList = this.state.selectedAttributeValues;
      const length = currentList.length;
      const newList = [];
      for (let i = 0; i < length; i++) {
        const currentItem = currentList[i];
        if (!currentItem.includes(attributeName)) {
          newList.push(currentItem);
        }
      }
      this.setState({ selectedAttributeValues: newList });
    };

    handleSelection = changeEvent => {
      const reportOption = changeEvent.target.value;
      const currentReports = this.state.selectedReports;
      if (currentReports.includes(reportOption)) {
        const index = this.state.selectedReports.indexOf(reportOption);
        currentReports.splice(index, 1);
        this.setState(
          { selectedReports: currentReports },
          this.updateIsSubmittable
        );
      } else {
        console.log(currentReports);
        currentReports.push(reportOption);
        console.log(currentReports);
        this.setState(
          { selectedReports: currentReports },
          this.updateIsSubmittable
        );
      }
    };

    handleUpload = e => {
      const listName = e.target.id + "ListUploaded";
      const urlName = e.target.id + "Url";
      const nameType = e.target.id + "Name";
      const inputType = e.target.id + "Input";
      const data = new FormData();
      data.append("file", this[inputType].files[0]);
      const fileName = this[inputType].files[0].name;

      fetch("/uploadFile/" + this.state.jobId + "/" + e.target.id, {
        method: "POST",
        body: data
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);
          this.setState({ [nameType]: fileName }, () => {
            console.log(nameType);
            console.log(this.state[nameType]);
          });
          this.setState({ [urlName]: responses.url });
          this.setState({ [listName]: true }, this.updateIsSubmittable);
        });
    };

    handleJobNameChange = e => {
      e.preventDefault();
      this.setState({ jobName: e.target.value });
    };

    handleSubmit = e => {
      e.preventDefault();

      const submitUrl = "/api/submitForm";

      const data = new FormData();
      data.append("customerUrl", this.state.customerUrl);
      data.append("hierarchyUrl", this.state.hierarchyUrl);
      data.append("materialUrl", this.state.materialUrl);
      data.append(
        "customerAttributes",
        this.state.selectedAttributeValues.join("|")
      );
      data.append("jobId", this.state.jobId);
      data.append("jobName", this.state.jobName);
      data.append("username", this.state.user.email);
      data.append(
        "customerOption",
        this.state.selectedCustomerOption.charAt(7)
      );
      data.append("reportOptions", this.createReportString());
      data.append("eligibilityOptions", this.createEligibilityString());

      fetch(submitUrl, {
        method: "POST",
        body: data
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);
          this.setState({ submitted: true });
        });
    };

    customerInputOkay = () => {
      const isOkay =
        this.state.selectedCustomerOption === "Option 3: Customer Attributes"
          ? true
          : this.state.selectedCustomerOption === "Option 2: Hierarchy File"
          ? this.state.hierarchyListUploaded
            ? true
            : false
          : this.state.selectedCustomerOption === "Option 1: Customer File"
          ? this.state.customerListUploaded
            ? true
            : false
          : false;
      return isOkay;
    };

    materialInputOkay = () => {
      return this.state.materialListUploaded ? true : false;
    };

    reportInputOkay = () => {
      return this.state.selectedReports.length === 0 ? false : true;
    };

    updateIsSubmittable = () => {
      const isSubmittable =
        this.customerInputOkay() &&
        this.materialInputOkay() &&
        this.reportInputOkay();
      if (isSubmittable !== this.state.isSubmittable) {
        this.setState({ isSubmittable: isSubmittable });
      }
    };

    createReportString = () => {
      const reports = this.state.selectedReports;
      console.log(reports);
      const reportIsSelected = report => (reports.includes(report) ? "1" : "0");
      return (
        reportIsSelected("Material SPA & Stock Report") +
        reportIsSelected("Customer Report") +
        reportIsSelected("Material Agreement Report Condensed") +
        reportIsSelected("Material Agreement Report Long Version")
      );
    };

    createEligibilityString = () => {
      const types = this.state.selectedEligibilityTypes;
      const typeIsSelected = type => (types.includes(type) ? "1" : "0");
      return (
        typeIsSelected("Customer") +
        typeIsSelected("Hierarchy") +
        typeIsSelected("COT/District") +
        typeIsSelected("COT/Sales Office")
      );
    };

    render() {
      const columnClasses = "col rounded border shadow m-2 p-4 pb-5";
      console.log(this.state.authenticated);
      if (
        this.state.authenticated === null ||
        this.state.authenticated === false
      ) {
        return <PageLoad />;
      }

      if (this.state.submitted) {
        return (
          <Redirect
            to={{
              pathname: "/user",
              state: {
                user: this.state.user.email,
                jobId: this.state.jobId,
                reportString: this.createReportString(),
                jobStatus: "PENDING"
              }
            }}
          />
        );
      } else {
        return (
          <div className="container p-0 ml-auto mr-auto mt-0">
            <div className="row m-0 p-0">
              <div className="col m-0 p-0">
                <NavBar jobId={this.state.jobId} user={this.state.user.email} />
              </div>
            </div>

            <div className="row">
              <div className="col p-3 mb-1">
                <h5
                  className="font-weight-bold"
                  style={{
                    fontSize: ".9em",
                    display: "inline"
                  }}
                >
                  Job Name: {this.props.jobId}
                </h5>

                <input
                  type="text"
                  className="font-weight-bold text-center ml-3 custom-input"
                  value={this.state.jobName}
                  onChange={this.handleJobNameChange}
                />
              </div>
            </div>

            <div className="row">
              <div className={columnClasses}>
                <Title title="Customers" />
                <br />
                <div className="mb-4">
                  <CustomerOptions
                    onOptionChange={this.handleOptionChange}
                    selectedOption={this.state.selectedCustomerOption}
                    reference={ref => {
                      this.customerInput = ref;
                    }}
                    hierarchyReference={ref => {
                      this.hierarchyInput = ref;
                    }}
                    onUpload={this.handleUpload}
                    onAttributeTypeSelection={this.handleAttributeSelection}
                    selectedAttributes={this.state.selectedAttributes}
                    selectedAttributeValues={this.state.selectedAttributeValues}
                    onSelectAllAttributes={this.handleSelectAllAttributes}
                    onDeselectAllAttributes={this.handleDeselectAllAttributes}
                    onSelectEligibilityType={
                      this.handleEligibilityTypeSelection
                    }
                    selectedEligibilityTypes={
                      this.state.selectedEligibilityTypes
                    }
                    customerFileName={this.state.customerName}
                    hierarchyFileName={this.state.hierarchyName}
                  />
                </div>
                <div
                  style={{
                    width: "85%",
                    position: "absolute",
                    bottom: "18px",
                    left: "24px"
                  }}
                >
                  <StatusBar
                    isOkay={this.customerInputOkay()}
                    errorText="Select attributes or upload customer/hierarchy list."
                  />
                </div>
              </div>
              <div className={columnClasses}>
                <Title title="Materials" />
                <br />

                <MaterialOptions
                  reference={ref => {
                    this.materialInput = ref;
                  }}
                  onUpload={this.handleUpload}
                  materialFileName={this.state.materialName}
                />
                <div
                  style={{
                    width: "85%",
                    position: "absolute",
                    bottom: "18px",
                    left: "24px"
                  }}
                >
                  <StatusBar
                    isOkay={this.materialInputOkay()}
                    errorText="Upload Material List"
                  />
                </div>
              </div>
              <div className={columnClasses}>
                <Title title="Reports" />
                <br />
                <ReportOptions onSelection={this.handleSelection} />
                <div
                  style={{
                    width: "85%",
                    position: "absolute",
                    bottom: "18px",
                    left: "24px"
                  }}
                >
                  <StatusBar
                    isOkay={this.reportInputOkay()}
                    errorText="Choose at least one report."
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col text-center">
                <Submit
                  onSubmitJob={this.handleSubmit}
                  reference={ref => {
                    this.btn = ref;
                  }}
                  isOkay={this.state.isSubmittable}
                />
              </div>
            </div>
          </div>
        );
      }
    }
  }
);
