import express from "express";
<<<<<<< HEAD
import { register, login, forgotPassword,
  resetPassword, } from "../controllers/authController.js";
=======
import { register, login } from "../controllers/authController.js";
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

<<<<<<< HEAD
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

=======
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
export default router;
