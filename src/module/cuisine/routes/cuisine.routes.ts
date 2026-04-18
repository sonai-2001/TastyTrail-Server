import { Router } from "express";
import * as cuisineController from "../controller/cuisineController";
import { authenticate, authorize } from "../../../middleware/auth.middleware";

const router = Router();

// Public route to fetch active cuisines (for onboarding)
router.get("/", cuisineController.getAllCuisines);

// Admin-only routes
router.post("/", authenticate, authorize("admin"), cuisineController.createCuisine);
router.patch("/:id", authenticate, authorize("admin"), cuisineController.updateCuisine);
router.delete("/:id", authenticate, authorize("admin"), cuisineController.deleteCuisine);

export default router;
