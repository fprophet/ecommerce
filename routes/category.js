const controller = require("../controllers/categoryController");

const express = require("express");

const router = express.Router();

router.get("/", controller.renderIndex);
router.post("/create", controller.create);

module.exports = router;
