import { Router } from "express";
import { getOnboardingController, updateOnboardingController } from "../controller/partner.controller";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { RoleEnum } from "../../../common/commonEnum";

const partnerRoutes = Router()

partnerRoutes.use(authenticate)
// partnerRoutes.use(authorize('res_partner'))
partnerRoutes.get('/onboardingDetals',getOnboardingController)
partnerRoutes.patch('/onboardingUpdate',updateOnboardingController)
export default partnerRoutes


