const router = require("express").Router();
const userControllers = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")

router.post("/register", userControllers.register);
router.get("/finalregister/:token", userControllers.finalregister);
router.post("/login", userControllers.login);
router.get("/current", verifyAccessToken, userControllers.getCurrent);
router.post("/refreshtoken", userControllers.refreshAccessToken);
router.get("/logout", userControllers.logOut);
router.post("/forgotpassword", userControllers.forgotPassword);
router.put("/resetpassword", userControllers.resetPassword);
router.get("/getusers", [verifyAccessToken, isAdmin], userControllers.getUsers);
router.post("/createusers", userControllers.createUsers);
router.delete(
  "/deleteuser/:uid",
  [verifyAccessToken, isAdmin],
  userControllers.deleteUserById
);
router.put("/current", [verifyAccessToken], uploader.single('avatar'),userControllers.updateUserById);
router.put("/address/", [verifyAccessToken], userControllers.updateUserAddress);
router.put("/cart/", [verifyAccessToken], userControllers.updateCartUser);
router.delete("/remove-cart/:pid", [verifyAccessToken], userControllers.removeProductInCart)
router.put("/blockuserbyadmin/:uid", userControllers.blockUserById);
router.put(
  "/updateUserByAdmin/:uid",
  [verifyAccessToken, isAdmin],
  userControllers.updateUserByAdmin
);

module.exports = router;

// CRUD: create - read - update - delete <=> post - get - put - delete
// create (post) + put - gửi theo body
// read (get) + delete - gửi theo query // ?key=value
