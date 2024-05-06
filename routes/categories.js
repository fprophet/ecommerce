const controller = require("../controllers/categoriesController");

const express = require("express");

const router = express.Router();

router.get("/", controller.renderIndex);

module.exports = router;
