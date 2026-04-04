import { Router } from "express";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { RoleEnum } from "../../../common/commonEnum";
import * as adminController from "../controller/admin.controller";

const router = Router();

// Protect all admin routes
router.use(authenticate);

router.patch(
  "/approve/:id",
  authorize(RoleEnum.ADMIN),
  adminController.approveRestaurant
);

router.patch(
  "/remove/:id",
  authorize(RoleEnum.ADMIN),
  adminController.removeRestaurant
);

export default router;
