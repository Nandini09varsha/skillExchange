import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google",googleAuth);

export default router;