import { Router } from "express";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { RoleEnum } from "../../../common/commonEnum";
import * as partnerController from "../controller/partner.controller";

const router = Router();

// Protect all partner routes
router.use(authenticate);

router.get(
  "/my-restaurants",
  authorize(RoleEnum.RESTAURANT_OWNER),
  partnerController.getMyRestaurants
);

router.patch(
  "/settings/:id",
  authorize(RoleEnum.RESTAURANT_OWNER),
  partnerController.updateRestaurantSettings
);

export default router;
