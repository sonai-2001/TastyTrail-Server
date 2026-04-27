import { Types } from "mongoose";
import { RestaurantOnboarding } from "../../../models/res_onnboarding.schema.";
import { UpdateOnboardingDto } from "../dtos/updateOnboardingDto";
import { ApiError } from "../../../utils/ApiError";
import { Restaurant } from "../../../models/restaurant.schema";
import { User } from "../../../models/user.schema.";

export const getOnboardingService = async (userId: Types.ObjectId | string) => {

  let onboarding = await RestaurantOnboarding.findOne({
    user: userId,
    completed: false
  });

  if (!onboarding) {
    onboarding = await RestaurantOnboarding.create({
      user: userId,
      step: 1
    });
  }

  return onboarding;
};



export const updateOnboardingService = async (
  userId: Types.ObjectId | string,
  data: UpdateOnboardingDto
) => {
  const { step, ...fields } = data;

  const onboarding = await RestaurantOnboarding.findOne({
    user: userId,
    status: { $in: ["draft", "rejected"] } // ✅ allow editing only
  });

  if (!onboarding) {
    throw new ApiError("Onboarding not found", 404);
  }

  // update fields
  Object.assign(onboarding, fields);

  if (step) {
    onboarding.step = step;
  }

  // ✅ Final step → submit for review
  if (step === 5) {
    const details = onboarding.restaurantDetails;

    if (!details?.restaurantName) {
      throw new ApiError("Restaurant name is required");
    }

    onboarding.status = "pending"; // 🔥 key change
  }

  await onboarding.save();

  return {
    onboarding
  };
};