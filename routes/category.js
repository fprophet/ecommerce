const controller = require("../controllers/categoryController");
const router = require("./baseRouter")(controller);

router.get("/", controller.getMainView);
router.post("/get-products", controller.getProductsForCategory);

module.exports = router;
