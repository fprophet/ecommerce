const productController = require("../controllers/productController");
const adminController = require("../controllers/adminController");

const router = require("./baseRouter")(productController);

router.get(
  "/",
  adminController.authorizeUser,
  productController.getMainAdminView
);

router.get(
  "/category/:category",
  adminController.authorizeUser,
  productController.getProductsForCategory
);

router.get("/:product", productController.getProductAndRender);
module.exports = router;
