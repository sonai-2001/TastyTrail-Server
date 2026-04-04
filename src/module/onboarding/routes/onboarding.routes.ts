import { Router } from "express";
import partnerRoutes from "./partner.routes";



const onboardingRoutes = Router();


onboardingRoutes.use("/partner", partnerRoutes);

export default onboardingRoutes;
