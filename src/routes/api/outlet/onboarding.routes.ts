import { Router } from "express";
import { createOutletSchema } from "../../../validations/outlet/outlet.schema";
import { validateCreateOutletRequest } from "../../../middleware/validate.middleware";
import { OnboardingController } from "../../../controllers/outlet/onboarding.controller";
import { createFieldBasedUploader } from "../../../middleware/upload";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { RoleEnum } from "../../../common/commonEnum";

const router = Router();

router.post(
  "/register",
  authenticate,
  authorize(RoleEnum.RESTAURANT_OWNER),
  createFieldBasedUploader([
    { name: "menuImages", folder: "outlet/menu", maxCount: 5 },
    { name: "fssaiLicenseDoc", folder: "outlet/fassai", maxCount: 1 },
    { name: "panDoc", folder: "outlet/pan", maxCount: 1 },
    { name: "cancelledChequeDoc", folder: "outlet/bank", maxCount: 1 },
  ]),
  validateCreateOutletRequest(createOutletSchema),
  OnboardingController.registerOutlet,
);

export default router;
