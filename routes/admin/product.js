const productController = require("../../controllers/productController");
const adminController = require("../../controllers/adminController");

const router = require("./baseRouter")(productController);

router.get(
  "/",
  adminController.authorizeUser,
  productController.getMainAdminView
);

router.get(
  "/category/:category",
  adminController.authorizeUser,
  productController.getAdminProductsForCategory
);

router.get(
  "/add",
  adminController.authorizeUser,
  productController.getAdminProductView
);

router.get("/:product", productController.getAdminProductAndRender);
module.exports = router;
