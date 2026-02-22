import express from "express";
import {
  createOrGetConversation,
  getUserConversations,
} from "../controllers/conversationController.js";

const router = express.Router();

// Create or get conversation
router.post("/", createOrGetConversation);

// Get all conversations of a user
router.get("/:userId", getUserConversations);

export default router;