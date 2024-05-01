const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");

router.get("/", controller.productsView);
router.post("/create", controller.create);
router.get("/add", controller.productsAddForm);

module.exports = router;
