const controller = require("../controllers/productController");
const router = require("./baseRouter")(controller);

// router.get("/add", controller.productsAddForm);

module.exports = router;
