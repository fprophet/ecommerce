module.exports = (controller) => {
  const express = require("express");
  const router = express.Router();

  const multer = require("multer");
  var storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  router.post("/create", upload.any(), controller.create);
  router.put("/update", controller.update);
  router.get("/get", controller.get);
  router.delete("/delete", controller.delete);

  // router.get("/", controller.getMainView);
  return router;
};
