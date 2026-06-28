import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import {
  getOnboardingData,
  saveStep1Personal,
  saveStep2Shop,
  saveStep3Business,
  saveStep4Payment,
  saveStep5Plan,
  completeOnboarding,
  clearOnboardingData,
} from "@/controllers/onboarding.controller";

const router = Router();

// Get all onboarding data
router.get("/data", requireAuth, getOnboardingData);

// Save individual steps
router.post("/step-1", requireAuth, saveStep1Personal);
router.post("/step-2", requireAuth, saveStep2Shop);
router.post("/step-3", requireAuth, saveStep3Business);
router.post("/step-4", requireAuth, saveStep4Payment);
router.post("/step-5", requireAuth, saveStep5Plan);

// Complete onboarding
router.post("/complete", requireAuth, completeOnboarding);

// Clear onboarding data
router.delete("/data", requireAuth, clearOnboardingData);

export default router;
