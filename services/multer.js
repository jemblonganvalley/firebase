const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      req.body.name.split(" ").join("-") + `.${file.mimetype.split("/")[1]}`
    );
  },
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../photo/product"));
  },
});

const upload_product = multer({ storage: storage });

module.exports = { upload_product };
