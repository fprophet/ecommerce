const controller = require("../controllers/adminController");
const router = require("./baseRouter")(controller);

router.get("/login", controller.loginView);
router.post("/login", controller.loginRequest);
router.get("/", controller.authorizeUser, controller.getMainView);

module.exports = router;
