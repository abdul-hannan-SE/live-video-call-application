const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("../middlewares/multer");
const path = require("path");
const { check } = require("express-validator");
const fs = require("fs");
const { verifyJWT } = require("../middlewares/jwt");

const directoryPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "images",
  "avatars"
);

fs.mkdirSync(directoryPath, { recursive: true });

const upload = multer.setFile({
  maxFileSize: 1 * 1024 * 1024,
  path: directoryPath,
});

// router.get("/user", authController.getUser);

router.post(
  "/signUp",
  upload.single("avatar"),

  // upload.fields([
  //   { name: "avatar", maxCount: 1 },
  //   { name: "coverImage", maxCount: 1 },
  // ]),
  [
    check("email")
      .notEmpty()
      .withMessage("email required")
      .trim()
      .isEmail()
      .escape()
      .withMessage("E-mail address invalid"),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 12 })
      .withMessage("Password must 6-12 char long"),
    check("username")
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isLength({ min: 6, max: 15 })
      .withMessage("username must 6-15 char long")
      .matches(/^[a-zA-Z][a-zA-Z0-9 ]*$/)
      .withMessage("Username incorrect"),
  ],
  authController.signUp
);

router.post(
  "/login",
  [
    check("email")
      .trim()
      .isEmail()
      .escape()
      .withMessage("E-mail address invalid"),
    check("password")
      .notEmpty()
      .isLength({ min: 6, max: 12 })
      .withMessage("Password should be 6-12 char long"),
  ],
  authController.login
);

router.post("/logOut", verifyJWT, authController.logOut);
router.get("/refreshToken", verifyJWT, authController.refreshToken);
router.get("/currentUser", verifyJWT, authController.getCurrentUser);
router.get("/allUsers", authController.getAllUsers);
module.exports = router;
