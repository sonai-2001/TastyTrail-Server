import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import { getOnboardingService, updateOnboardingService } from "../services/onboardingService";

export const getOnboardingController = asyncHandler(async (req, res) => {

  const userId = req.user!.id;

  const onboarding = await getOnboardingService(userId);

  return success(res, {
    data: onboarding,
    message: "Onboarding fetched"
  });

});


export const updateOnboardingController = asyncHandler(async (req, res) => {

  const userId = req.user!.id;

  const onboarding = await updateOnboardingService(
    userId,
    req.body
  );

  return success(res, {
    data: onboarding,
    message: "Onboarding updated"
  });

});