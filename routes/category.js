const categoryController = require("../controllers/categoryController");
const adminController = require("../controllers/adminController");

const router = require("./baseRouter")(categoryController);

router.get(
  "/",
  adminController.authorizeUser,
  categoryController.getMainAdminView
);
router.post("/get-products", categoryController.getProductsForCategory);

module.exports = router;
