const productController = require("../../controllers/productController");

router.get("/:category/:product", productController.getProductView);
module.exports = router;
