const multer = require("multer");
const storageEngine = require("./customGCPStorage");

const datetime = Date.now();

const upload = multer({
  storage: storageEngine({
    destination: function(req, file, cb) {
      console.log(req);
      cb(
        null,
        "projects/cost_benchmark/phase_3/input_files/" + datetime + ".csv"
      );
    }
  })
});

module.exports = upload;
