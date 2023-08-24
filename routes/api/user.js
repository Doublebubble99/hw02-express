const express = require("express");
const { upload } = require("../../middlewares");
const ctrlUser = require("../../controllers/user");
const { checkTokenValidate } = require("../../middlewares");
const router = express.Router();
router.post("/register", ctrlUser.register);
router.post("/login", ctrlUser.login);
router.get("/current", checkTokenValidate, ctrlUser.current);
router.post("/logout", checkTokenValidate, ctrlUser.logout);
router.patch(
  "/avatars",
  checkTokenValidate,
  upload.single("avatar"),
  ctrlUser.updateAvatar
);
module.exports = router;
