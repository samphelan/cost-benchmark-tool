# Cost Benchmark Tool

Application that allows business users to intiate a PySpark ETL script that retrieves information regarding SPA (Special Pricing Agreement) and into-stock costs.

## Getting Started

### Prerequisites

- Download and install [MySQL](https://dev.mysql.com/downloads/installer/).
  - Make sure you've added MySQL to your PATH variables or else you will have trouble with restoring data during api tests.
  - For CentOS use [this link to install MySQL](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7).
- Download and install [Node.js & NPM](https://nodejs.org/en/download/).
- Download and install [Google Cloud SDK](https://cloud.google.com/sdk/docs/)
  - Run `gcloud auth application-default login`, then `gcloud auth application-default login` in the command line after installation.

### Start-up Instructions

1. `git clone https://bitbucket.org/graybar/cost-benchmark/`
2. `cd ./cost-benchmark`
3. Add `.env` file with the following variables to the `/api` folder to match your MySQL credentials. The VCAP_SERVICES variable is structured so that you won't have to change the code when it is pushed to PCF.

```
GOOGLE_APPLICATION_CREDENTIALS=service_account.json
GCLOUD_STORAGE_BUCKET=data-discovery
GCLOUD_PROJECT=data-discovery-184619
MYSQL_DB=cost_benchmark
USERS_TABLE=users
VCAP_SERVICES={"p.mysql": [{"credentials": {"hostname": "localhost","username": "root","password": YOUR_PASSWORD}}] }
```

4. Log in to Google Cloud Platform and choose Data Discovery (data-discovery-184619) as your project. Go to IAM & admin > Service Accounts and click "CREATE SERVICE ACCOUNT" at the top. Save the resulting `service_account.json` file in the `/api` folder of the project. If you do not have access to the Data Discovery project, contact Eleni Anas, Jeremy Salazar, or someone on the Data Discovery team.
5. `npm installAll`
6. `npm run startAll`

### Build Instructions

1. In the root directory, run `npm run buildAll` to create a production-ready build folder called "production_build". This build folder was designed to be easily deployable to PCF.
2. Install the [PCF CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html).
3. `cf login --sso`
4. `npm run deploy`
