import { Router } from "express";
import onboardingRoutes from "./onboarding.routes";

const outletRouter = Router();

outletRouter.use("/onboarding", onboardingRoutes);

export default outletRouter;