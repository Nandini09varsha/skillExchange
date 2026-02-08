import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMatchRequest,
  getIncomingRequests,
  respondToRequest,
} from "../controllers/matchRequestController.js";

const router = express.Router();

router.post("/send", protect, sendMatchRequest);
router.get("/incoming", protect, getIncomingRequests);
router.put("/respond/:id", protect, respondToRequest);

export default router;
