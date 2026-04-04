import { Router } from "express";
import authRoutes from "../module/auth/routes/authRoutes";
import restaurantRoutes from "../module/restaurant/routes/restaurant.routes";
import onboardingRoutes from "../module/onboarding/routes/onboarding.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/onboarding", onboardingRoutes);

export default router;
