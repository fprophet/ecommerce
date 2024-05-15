const controller = require("../controllers/adminController");
const router = require("./baseRouter")(controller);

router.get("/login", controller.loginView);

module.exports = router;
