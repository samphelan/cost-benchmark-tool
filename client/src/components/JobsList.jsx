import React, { Component } from "react";

class JobsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: this.calculateTotalPages(props.jobs.length)
    };
  }

  handleNextPage = () => {
    const currentPage = this.state.currentPage;
    if (currentPage < this.state.totalPages) {
      this.setState({ currentPage: currentPage + 1 });
    }
  };

  handlePreviousPage = () => {
    const currentPage = this.state.currentPage;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  calculateTotalPages = numJobs => {
    const pages = Math.floor(numJobs / 15);
    if (numJobs % 15 !== 0) {
      return pages + 1;
    } else {
      return pages;
    }
  };

  getDisplayArray = (arr, page) => {
    const endIndex = page * 15;
    const beginIndex = endIndex - 15;
    return arr.slice(beginIndex, endIndex);
  };

  convertToDate = epochSeconds => {
    const d = new Date(0);
    d.setUTCMilliseconds(epochSeconds);
    return d.toLocaleDateString();
  };

  render() {
    return (
      <div className="container m-0 p-0">
        {this.props.jobs.length === 0 ? (
          <div className="row text-center mt-5 mb-5 font-italic">
            <div className="col">No Jobs Yet</div>
          </div>
        ) : (
          <React.Fragment>
            {this.getDisplayArray(this.props.jobs, this.state.currentPage).map(
              job => (
                <div
                  className={
                    this.props.selectedJob.job_id === job.job_id
                      ? "row job-list-selected p-1 m-0"
                      : "row job-list p-1 m-0"
                  }
                  key={job.job_id}
                  id={job.job_id}
                >
                  <div
                    className="col-4"
                    id={job.job_id}
                    onClick={this.props.onSelectJob}
                  >
                    {this.convertToDate(job.job_id)}
                  </div>
                  <div
                    className="col"
                    id={job.job_id}
                    onClick={this.props.onSelectJob}
                  >
                    {job.job_name}
                  </div>
                </div>
              )
            )}
            <div className="row text-center mt-4 mb-4 p-0">
              <div className="col p-2">
                <button
                  className="btn btn-primary mb-auto mt-auto"
                  onClick={this.handlePreviousPage}
                  disabled={this.state.currentPage === 1}
                >
                  Prev
                </button>
              </div>
              <div className="col mb-auto mt-auto p-2">
                Page {this.state.currentPage} of {this.state.totalPages}
              </div>
              <div className="col p-2">
                <button
                  className="btn btn-primary mb-auto mt-auto ml-0"
                  onClick={this.handleNextPage}
                  disabled={this.state.currentPage === this.state.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default JobsList;
