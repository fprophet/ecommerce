const controller = require("../controllers/productController");
const router = require("./baseRouter")(controller);

router.get("/", controller.getMainAdminView);

router.get("/:product", controller.getProductAndRender);
module.exports = router;
