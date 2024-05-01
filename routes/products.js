const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");

router.get("/create", controller.create);
router.get("/", controller.productsView);

module.exports = router;
