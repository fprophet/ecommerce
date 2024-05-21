module.exports = (controller) => {
  const express = require("express");
  const router = express.Router();

  router.post("/create", controller.create);
  router.put("/update", controller.update);
  router.get("/get", controller.get);
  router.delete("/delete", controller.delete);

  // router.get("/", controller.getMainView);
  return router;
};
