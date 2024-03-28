const multer = require("multer");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  fileFilter: multerFilter,
  limits: { fileSize: 4000000 },
});

module.exports = { upload };
