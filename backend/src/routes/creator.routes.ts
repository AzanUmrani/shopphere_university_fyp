import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import {
  applyToBeCreator,
  getCreatorStatus,
  getCreatorProfile,
  updateCreatorProfile,
  getCreatorStats,
  getCreatorById,
} from "@/controllers/creator.controller";

const router = Router();

// Creator management routes
router.post("/apply", requireAuth, applyToBeCreator);
router.get("/status", requireAuth, getCreatorStatus);
router.get("/profile", requireAuth, getCreatorProfile);
router.put("/profile", requireAuth, updateCreatorProfile);
router.get("/stats", requireAuth, getCreatorStats);

// Public creator profile
router.get("/:id", getCreatorById);

export default router;
