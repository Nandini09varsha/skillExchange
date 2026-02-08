// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { getMatchSuggestions } from "../controllers/matchController.js";

// const router = express.Router();

// router.get("/suggestions", protect, getMatchSuggestions);

// export default router;

// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { getMatchSuggestions } from "../controllers/matchController.js";

// const router = express.Router();

// router.get("/suggestions", protect, getMatchSuggestions);

// export default router;
// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   sendMatchRequest,
//   getIncomingRequests,
//   respondToRequest,
// } from "../controllers/matchRequestController.js";

// const router = express.Router();

// router.post("/send", protect, sendMatchRequest);
// router.get("/incoming", protect, getIncomingRequests);
// router.put("/respond/:id", protect, respondToRequest);

// export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMatchSuggestions } from "../controllers/matchController.js";

const router = express.Router();

// ✅ THIS is what frontend is calling
router.get("/suggestions", protect, getMatchSuggestions);

export default router;

