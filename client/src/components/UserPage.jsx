import React, { Component } from "react";
import NavBar from "./NavBar";
import JobRunning from "./JobRunning";
import PageLoad from "./PageLoad";
import JobsList from "./JobsList";
import { Link } from "react-router-dom";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class UserPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        jobs: [],
        selectedJob: {},
        user: "",
        selectedJobStatus: { state: "PENDING", details: "" },
        jobsLoaded: false,
        noJobs: true
      };
      console.log(props.auth);
    }

    async componentDidMount() {
      let user = "";
      if (this.props.location) {
        user = this.props.location.state.user;
      } else {
        user = await this.props.auth.getUser();
        user = user.email;
        this.setState({ user: user });
      }
      await this.loadJobs(user);
      this.loadJobDetails(this.state.selectedJob.job_id);
    }

    loadJobs = async user => {
      return new Promise((resolve, reject) => {
        fetch("/api/getUserJobs/" + user, {
          method: "GET"
        })
          .then(responses => responses.json())
          .then(responses => {
            console.log(responses);

            if (responses.length === 0) {
              this.setState({ noJobs: true }, () => {
                this.setState({ jobsLoaded: true });
                resolve();
              });
            } else {
              this.setState({ noJobs: false });
              this.setState({ jobs: responses });
              this.setState({ selectedJob: responses[0] }, () => {
                this.setState({ jobsLoaded: true });
                resolve(responses[0]);
              });
            }
          });
      });
    };

    loadJobDetails = jobId => {
      console.log(jobId);
      fetch("/api/getJobStatus/" + jobId, {
        method: "GET"
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);

          this.setState({ selectedJobStatus: responses }, () => {
            const jobState = this.state.selectedJobStatus.state;
            if (
              jobState !== "DONE" &&
              jobState !== "ERROR" &&
              jobState !== "CANCELLED" &&
              this.state.selectedJob.job_id === jobId
            ) {
              this.loadJobDetails(jobId);
            } else if (
              jobState === "DONE" &&
              this.state.selectedJob.job_id === jobId
            ) {
              this.checkIfReportsExists(jobId);
            }
          });
        });
    };

    checkIfReportsExists = jobId => {
      fetch("/api/getReportUrls/" + jobId, { method: "GET" })
        .then(responses => responses.json())
        .then(async responses => {
          console.log(responses[0]);
          const jobIndex = this.getJobById(jobId);
          const reports = this.state.jobs[jobIndex].report_options;

          for (let i = 0; i < reports.length; i++) {
            if (reports.charAt(i) === "1") {
              if (responses[0]["report" + (i + 1) + "_location"] === null) {
                this.createOutputFile(jobId, i + 1);
              }
            }
          }
        });
    };

    getJobById = jobId => {
      for (let i = 0; i < this.state.jobs.length; i++) {
        if (this.state.jobs[i].job_id === jobId) {
          return i;
        }
      }
      return -1;
    };

    createOutputFile = (jobId, reportId) => {
      console.log(reportId);
      console.log("jobId: " + jobId);

      fetch("/api/getReports/" + jobId + "/" + reportId, {
        method: "GET"
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);

          const location = encodeURIComponent(responses.location);
          console.log(location);
          const data = new FormData();
          data.append("url", responses.location);
          fetch("/api/updateReportUrl/" + jobId + "/" + reportId, {
            method: "POST",
            body: data
          })
            .then(responses => responses.json())
            .then(responses => {
              console.log(responses);
              const index = this.getJobById(jobId);
              const jobDetails = this.state.jobs[index];
              jobDetails["report" + reportId + "_location"] =
                responses.response;
              const jobs = this.state.jobs;
              jobs[index] = jobDetails;
              this.setState({ jobs });
            })
            .catch(err => {
              console.log(err);
            });
        });
    };

    handleDownload = event => {
      const reportId = event.target.value;
      const reportLocation = this.state.selectedJob[
        "report" + reportId + "_location"
      ];
      const reportMap = {
        1: "material_summary",
        2: "customer_report",
        3: "material_agreement_condensed",
        4: "material_agreement_long"
      };

      fetch(
        "/api/getSignedUrl/" +
          encodeURIComponent(reportLocation) +
          "/" +
          reportMap[parseInt(reportId)] +
          "_" +
          this.state.selectedJob.job_name +
          ".csv",
        {
          method: "GET"
        }
      )
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses);
          const aTag = document.createElement("a");
          aTag.setAttribute("download", "report_" + reportId + ".csv");
          aTag.setAttribute("href", responses);
          aTag.click();
        });
    };

    handleSelectJob = e => {
      const jobId = e.target.id;
      let index = 0;
      for (let i = 0; i < this.state.jobs.length; i++) {
        if (this.state.jobs[i].job_id === jobId) {
          index = i;
          break;
        }
      }

      console.log(jobId);
      this.setState({ selectedJob: this.state.jobs[index] });
      this.setState({ selectedJobStatus: {} }, () => {
        this.loadJobDetails(jobId);
      });
    };

    handleCancelJob = e => {
      const jobId = this.state.selectedJob.job_id;
      fetch("/api/cancelJob/" + jobId, {
        method: "GET"
      })
        .then(responses => responses.json())
        .then(responses => {
          console.log(responses[0]);
        });
    };

    formatTime = seconds => {
      if (seconds) {
        return (
          (Math.floor(seconds / 60) + "").padStart(2, "0") +
          ":" +
          ((seconds % 60) + "").padStart(2, "0")
        );
      } else {
        return "";
      }
    };

    getReportNames = reportString => {
      let names = [];
      if (reportString.charAt(0) === "1")
        names.push(["Material SPA & Stock Report", 1]);
      if (reportString.charAt(1) === "1") names.push(["Customer Report", 2]);
      if (reportString.charAt(2) === "1")
        names.push(["Material Agreement Report Condensed", 3]);
      if (reportString.charAt(3) === "1")
        names.push(["Material Agreement Report Long", 4]);
      return names;
    };

    convertToDate = epochSeconds => {
      const d = new Date(0);
      d.setUTCMilliseconds(epochSeconds);
      return d.toLocaleDateString();
    };

    render() {
      console.log(this.state.selectedJob);

      return (
        <div className="container mt-0 p-0">
          <div className="row">
            <div className="col">
              <NavBar
                jobId={this.state.selectedJob.job_id || "None"}
                user={this.state.user}
              />
            </div>
          </div>

          {!this.state.jobsLoaded ? (
            <PageLoad />
          ) : (
            <div className="row">
              <div className="col-4 m-0 p-2">
                <div className="border rounded shadow">
                  <div className="row m-0 mb-2 p-0 pb-2 pt-2 border-bottom">
                    <div className="col">
                      <h5
                        className="font-weight-bold mt-auto mb-auto"
                        style={{ fontSize: ".9em", color: "#888888" }}
                      >
                        My Jobs
                      </h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <JobsList
                        jobs={this.state.jobs}
                        selectedJob={this.state.selectedJob}
                        onSelectJob={this.handleSelectJob}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {this.state.noJobs ? (
                <div className="col m-2 mt-auto mb-auto p-2 text-center">
                  <Link
                    className="font-weight-bold"
                    style={{ fontSize: "1.4em" }}
                    to="/"
                  >
                    Create a New Job
                  </Link>
                </div>
              ) : (
                <div className="col m-0 p-2">
                  <div className="border rounded shadow pb-4">
                    <div className="row m-0 mb-2 p-0 pb-2 pt-2 border-bottom">
                      <div className="col text-center">
                        <h5
                          className="font-weight-bold mt-auto mb-auto"
                          style={{ fontSize: ".9em", color: "#888888" }}
                        >
                          {this.state.selectedJob.job_name}
                        </h5>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <div className="row">
                          <div className="col text-center">
                            <h4 className="mt-2 mb-3">Details</h4>
                          </div>
                        </div>
                        <div className="row m-0 p-0">
                          <div className="col text-right">Job ID:</div>
                          <div className="col">
                            {this.state.selectedJob.job_id}
                          </div>
                        </div>

                        <div className="row m-0 p-0">
                          <div className="col text-right">Job Status:</div>
                          <div className="col">
                            {(this.state.selectedJobStatus.state || "") +
                              " " +
                              (this.state.selectedJobStatus.details || "")}
                          </div>
                        </div>

                        <div className="row m-0 p-0">
                          <div className="col text-right">Time:</div>
                          <div className="col">
                            {this.formatTime(this.state.selectedJobStatus.time)}
                          </div>
                        </div>
                      </div>
                      <div className="col text-center">
                        <div className="row">
                          <div className="col">
                            <h4 className="mt-2 mb-3">Reports</h4>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            {this.state.selectedJobStatus.state ===
                            "RUNNING" ? (
                              <div className="row m-0 mt-3 p-0 text-center">
                                <div className="col mr-auto ml-auto text-center">
                                  <JobRunning />
                                </div>
                              </div>
                            ) : (
                              this.getReportNames(
                                this.state.selectedJob.report_options || "0000"
                              ).map(report => (
                                <div className="row" key={report}>
                                  <div className="col">
                                    {this.state.selectedJob[
                                      "report" + report[1] + "_location"
                                    ] === null ? (
                                      <div style={{ color: "#aaaaaa" }}>
                                        {report[0]}
                                      </div>
                                    ) : (
                                      <button
                                        className="link-button"
                                        value={report[1]}
                                        onClick={this.handleDownload}
                                      >
                                        {report[0]}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.selectedJobStatus.state === "RUNNING" ? (
                      <div className="row text-center mt-3 mb-3">
                        <div className="col">
                          <button
                            className="btn btn-danger"
                            onClick={this.handleCancelJob}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
);
