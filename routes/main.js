const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getMainView);
router.get("/:category/:product", productController.getProductView);

module.exports = router;
