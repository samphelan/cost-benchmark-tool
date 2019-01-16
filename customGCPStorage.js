const storage = require("@google-cloud/storage");

// Enable usage of environment variables. Delete for Production
require("dotenv").config();

// Instantiate a storage client
const storageClient = new storage.Storage({
  projectId: process.env.GCLOUD_PROJECT
});
const bucket = storageClient.bucket(process.env.GCLOUD_STORAGE_BUCKET);

function getDestination(req, file, cb) {
  cb(null, "/dev/null");
}

function MyCustomStorage(opts) {
  this.getDestination = opts.destination || getDestination;
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  console.log(req);
  this.getDestination(req, file, function(err, path) {
    if (err) return cb(err);
    console.log(req.body);
    console.log(path);

    var outStream = bucket.file(path).createWriteStream();

    file.stream.pipe(outStream);
    outStream.on("error", cb);
    outStream.on("finish", function() {
      cb(null, {
        path: path,
        size: outStream.bytesWritten
      });
    });
  });
};

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {};

module.exports = function(opts) {
  return new MyCustomStorage(opts);
};
