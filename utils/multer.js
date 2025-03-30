import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG and PNG images are allowed."),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter, // Add the file filter
});

// exports.uploadCompanyInfoImage = util.promisify(upload);
