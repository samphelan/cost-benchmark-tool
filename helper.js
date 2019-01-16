const storage = require("@google-cloud/storage");
const dataproc = require("@google-cloud/dataproc");

require("dotenv").config();

const storageClient = new storage.Storage({
  projectId: process.env.GCLOUD_PROJECT
});

const jobs = new dataproc.v1.JobControllerClient({});

const clusters = new dataproc.v1.ClusterControllerClient();

const bucket = storageClient.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const combineRawOutput = (jobId, reportType) => {
  let report = "";
  switch (reportType) {
    case "1":
      report = "material_summary";
      break;
    case "2":
      report = "customer_report";
      break;
    case "3":
      report = "material_agreement_report_condensed";
      break;
    case "4":
      report = "material_agreement_report_long";
      break;
    default:
      report = "material_summary";
      break;
  }

  const combineFiles = async (options, outputPath, additionalFiles) => {
    const responses = await bucket.getFiles(options);
    const files = responses[0];
    if (additionalFiles) {
      files.push(additionalFiles);
    }
    if (files.length < 2) {
      const emptyFile = await bucket.file(
        "projects/cost_benchmark/phase_3/output_files/empty.csv"
      );
      files.push(emptyFile);
    }
    const combinedFile = await bucket.file(outputPath);
    return bucket.combine(files, combinedFile);
  };

  const path =
    "projects/cost_benchmark/phase_3/output_files/" +
    jobId +
    "_" +
    report +
    "/";

  return combineFiles({ prefix: path + "part" }, path + "report.csv").then(
    responses => {
      return combineFiles(
        {
          prefix:
            "projects/cost_benchmark/phase_3/output_files/" +
            report +
            "_headers"
        },
        path + "final_report.csv",
        responses[0]
      );
    }
  );
};

const startDataProcJob = (
  jobId,
  customerOption,
  customerAttributes,
  eligibilityOptions,
  reportOptions,
  customerFile,
  materialFile
) => {
  const request = {
    projectId: process.env.GCLOUD_PROJECT,
    region: "global",
    job: {
      placement: {
        clusterName: "cost-benchmark"
      },
      reference: {
        jobId: jobId
      },
      pysparkJob: {
        mainPythonFileUri:
          "gs://data-discovery/projects/cost_benchmark/phase_3/cost_benchmark_gcp_test.py",
        args: [
          customerOption,
          customerAttributes,
          eligibilityOptions,
          reportOptions,
          customerFile,
          materialFile,
          jobId
        ],
        pythonFileUris: [
          "gs://data-discovery/projects/cost_benchmark/phase_3/cost_benchmark_constants.py"
        ]
      }
    }
  };

  jobs.submitJob(request).then(responses => {
    res.send({ jobId: jobId });
  });
};

module.exports = { combineRawOutput, startDataProcJob, jobs, clusters, bucket };
