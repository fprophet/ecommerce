const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");

router.get("/", controller.productsView);

router.get("/add", controller.productsAddForm);

router.delete("/delete", controller.delete);
router.post("/create", controller.create);
router.put("/update", controller.update);

module.exports = router;
