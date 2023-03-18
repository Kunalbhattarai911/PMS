const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
// router.patch("/updateuser", protect, upload.single("image"), updateUser);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.delete("/removeuser/:id", protect ,deleteUser)

module.exports = router;
