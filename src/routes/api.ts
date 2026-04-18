import { Router } from "express";
import authRoutes from "../module/auth/routes/authRoutes";
import restaurantRoutes from "../module/restaurant/routes/restaurant.routes";
import onboardingRoutes from "../module/onboarding/routes/onboarding.routes";
import uploadRoutes from "../module/upload/routes";
import cuisineRoutes from "../module/cuisine/routes/cuisine.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/upload", uploadRoutes);
router.use("/cuisines", cuisineRoutes);

export default router;
