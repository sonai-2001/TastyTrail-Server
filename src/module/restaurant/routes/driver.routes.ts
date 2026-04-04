import { Router } from "express";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { RoleEnum } from "../../../common/commonEnum";
import * as driverController from "../controller/driver.controller";

const router = Router();

// Protect all driver routes
router.use(authenticate);

router.get(
  "/pickup/:id",
  authorize(RoleEnum.DELIVERY_PARTNER),
  driverController.getPickupLocationDetail
);

export default router;
