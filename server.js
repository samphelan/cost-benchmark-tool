const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const googleapis = require("googleapis");
const Datastore = require("@google-cloud/datastore");
const {
  combineRawOutput,
  startDataProcJob,
  jobs,
  clusters,
  bucket
} = require("./helper");
const upload = require("./upload");

require("dotenv").config();

const credentials = JSON.parse(process.env.VCAP_SERVICES)["p.mysql"][0][
  "credentials"
];

const sqlCredentials = {
  host: credentials["hostname"],
  user: credentials["username"],
  password: credentials["password"]
};

const connection = mysql.createConnection(sqlCredentials);

const datastore = new Datastore({ projectId: process.env.GCLOUD_PROJECT });

const app = express();

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/api/attributes/:attribute", (req, res) => {
  try {
    const column = "value";
    const table = req.params.attribute + "_values";
    const queryString =
      `SELECT ${column} FROM ` +
      process.env.MYSQL_DB +
      `.${table} GROUP BY ${column}`;
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }

      res.json(rows);
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/attributes", (req, res) => {
  const queryString = `SELECT Tables_in_cost_benchmark AS tables FROM (SHOW TABLES)`;
  console.log("hello");
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    }
    res.json(rows);
  });
});

app.post(
  "/uploadFile/:jobId/:fileType",
  upload.single("file"),
  async (req, res, next) => {
    console.log(req.file);
    const newLocation =
      "projects/cost_benchmark/phase_3/input_files/" +
      req.params.jobId +
      "_" +
      req.params.fileType +
      "_input.csv";

    await bucket.file(req.file.path).move(newLocation);
    res.send({ url: newLocation });
  }
);

app.post("/api/submitForm", upload.none(), (req, res, next) => {
  console.log(req.body);
  let customerFile;
  switch (req.body.customerOption) {
    case "1":
      customerFile = req.body.customerUrl;
      break;
    case "2":
      customerFile = req.body.hierarchyUrl;
      break;
    case "3":
      customerFile = "";
      break;
    default:
      customerFile = "";
      break;
  }

  startDataProcJob(
    req.body.jobId,
    req.body.customerOption,
    req.body.customerAttributes,
    req.body.eligibilityOptions,
    req.body.reportOptions,
    customerFile,
    req.body.materialUrl
  );

  const queryString =
    `INSERT INTO ` +
    process.env.MYSQL_DB +
    `.jobs (job_id, job_name, username, report_options, customer_option, eligibility_options) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    queryString,
    [
      req.body.jobId,
      req.body.jobName,
      req.body.username,
      req.body.reportOptions,
      req.body.customerOption,
      req.body.eligibilityOptions
    ],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
        console.log(err);
      }
      res.json(rows);
    }
  );
});

app.get("/api/getUserJobs/:user", (req, res) => {
  connection.query(
    "SELECT * FROM " +
      process.env.MYSQL_DB +
      ".jobs WHERE username = ? ORDER BY job_id DESC",
    [req.params.user],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
        console.log(err);
      }
      res.json(rows);
    }
  );
});

app.get("/api/getClusterStatus/:clusterName", (req, res) => {
  const cluster = {
    projectId: process.env.GCLOUD_PROJECT,
    region: "global",
    clusterName: req.params.clusterName
  };

  clusters.getCluster(cluster).then(
    responses => {
      console.log(responses[0]);
      res.send(responses);
    },
    err => {
      console.log(err);
      if (err.code === 5) {
        res.json({ status: "not found" });
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/api/getJobStatus/:jobId", (req, res) => {
  const jobStatus = {
    projectId: process.env.GCLOUD_PROJECT,
    region: "global",
    jobId: req.params.jobId
  };
  console.log("getJobStatus called.");

  jobs
    .getJob(jobStatus)
    .then(responses => {
      console.log(responses[0]);

      if (
        responses[0].status.state === "DONE" ||
        responses[0].status.state === "ERROR" ||
        responses[0].status.state === "CANCELLED"
      ) {
        const timeElapsed =
          responses[0].status.stateStartTime.seconds -
          responses[0].statusHistory[2].stateStartTime.seconds;
        console.log(timeElapsed);
        res.json({
          state: responses[0].status.state,
          details: responses[0].status.details,
          time: timeElapsed
        });
      } else {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const timeStarted = responses[0].status.stateStartTime.seconds;
        const timeElapsed = currentTime - timeStarted;
        res.json({
          state: responses[0].status.state,
          details: responses[0].status.details,
          time: timeElapsed
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({ error: err });
    });
});

app.get("/api/getReports/:jobId/:reportType", (req, res) => {
  combineRawOutput(req.params.jobId, req.params.reportType)
    .then(responses => {
      console.log(responses[0].name);
      res.json({ location: responses[0].name });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/api/getSignedUrl/:location/:filename", (req, res) => {
  console.log(req.params.location);
  const name = req.params.filename || "output.csv";
  bucket
    .file(req.params.location)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + 76000000,
      responseDisposition: "filename=" + name
    })
    .then(response => {
      console.log(response[0]);
      res.json(response[0]);
    });
});

app.post("/api/updateReportUrl/:jobId/:report", upload.none(), (req, res) => {
  console.log(req.body.url);
  console.log(encodeURI(req.body.url));
  connection.query(
    "UPDATE " +
      process.env.MYSQL_DB +
      ".jobs SET report?_location = ? WHERE job_id = ?",
    [parseInt(req.params.report), req.body.url, req.params.jobId],
    (err, rows, fields) => {
      if (err) {
        res.json({ response: "error" });
        console.log(err);
      } else {
        console.log(rows);
        res.json({ response: req.body.url });
      }
    }
  );
});

app.get("/api/getReportUrls/:jobId", (req, res) => {
  connection.query(
    "SELECT report1_location, report2_location, report3_location, report4_location FROM " +
      process.env.MYSQL_DB +
      ".jobs WHERE job_id = ?",
    [req.params.jobId],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
      } else {
        console.log(rows);
        res.json(rows);
      }
    }
  );
});

app.get("/api/cancelJob/:jobId", (req, res) => {
  const request = {
    projectId: process.env.GCLOUD_PROJECT,
    region: "global",
    jobId: req.params.jobId
  };
  jobs
    .cancelJob(request)
    .then(responses => {
      console.log(responses);
      res.json(responses);
    })
    .catch(err => {
      console.error(err);
      res.send({ error: err });
    });
});

app.post("/api/submitProblem", upload.none(), (req, res) => {
  // The kind for the new entity
  const kind = "cost_benchmark_error";
  // The name/ID for the new entity
  const name = req.body.jobId;
  // The Cloud Datastore key for the new entity
  const taskKey = datastore.key({ namespace: "default", path: [kind, name] });

  // Prepares the new entity
  const task = {
    key: taskKey,
    data: {
      email: req.body.email,
      jobId: req.body.jobId,
      problemType: req.body.problemType,
      description: req.body.description
    }
  };

  console.log(task);

  // Saves the entity
  datastore
    .save(task)
    .then(() => {
      console.log(`Saved ${task.key.name}: ${task.data.description}`);
      res.json({
        response: `Saved ${task.key.name}: ${task.data.description}`
      });
    })
    .catch(err => {
      console.error("ERROR:", err);
      res.json({ response: "ERROR:" + err });
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
