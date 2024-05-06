const controller = require("../controllers/categoriesController");

const express = require("express");

const router = express.Router();

router.get("/", controller.renderIndex);
router.post("/create", controller.createCategory);

module.exports = router;
