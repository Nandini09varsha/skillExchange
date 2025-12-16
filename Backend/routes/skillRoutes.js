import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, (req, res) => {
  res.json({
    message: "Skill added",
    user: req.user._id,
  });
});

export default router;
