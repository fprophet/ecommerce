const controller = require("../controllers/adminController");
const router = require("./baseRouter")(controller);

router.get("/login", function (req, res, next) {
  controller.authorizeUser(req, res, next);
  if (res.statusCode == 200) {
    res.redirect("/admin");
  } else {
    controller.loginView(req, res, next);
  }
});

router.post("/login", controller.loginRequest);
// router.post("/logout", controller.loginRequest);
router.get("/", controller.authorizeUser, controller.getMainView);

module.exports = router;
