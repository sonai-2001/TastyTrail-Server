import { Router } from "express";

import adminRoutes from "./admin.routes";
import partnerRoutes from "./partner.routes";
import userRoutes from "./user.routes";
import driverRoutes from "./driver.routes";

const router = Router();

// Publicly available user routes
router.use("/", userRoutes);

// Mount role-specific protected routes
// These routers handle their own 'authenticate' and 'authorize' logic
router.use("/admin", adminRoutes);
router.use("/partner", partnerRoutes);
router.use("/driver", driverRoutes);

export default router;
