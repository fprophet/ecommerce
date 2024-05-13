const controller = require("../controllers/categoryController");
const router = require("./baseRouter")(controller);

router.post("/get-products", controller.getProductsForCategory);

module.exports = router;
