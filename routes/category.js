const controller = require("../controllers/categoryController");
const router = require("./baseRouter")(controller);

router.get("/", controller.getMainAdminView);
router.post("/get-products", controller.getProductsForCategory);

module.exports = router;
