import { Types } from "mongoose";
import { RestaurantOnboarding } from "../../../models/res_onnboarding.schema.";
import { UpdateOnboardingDto } from "../dtos/updateOnboardingDto";
import { ApiError } from "../../../utils/ApiError";
import { Restaurant } from "../../../models/restaurant.schema";

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
    completed: false
  });

  if (!onboarding) {
    throw new ApiError("Onboarding not found", 404);
  }

  Object.assign(onboarding, fields);

  if (step) {
    onboarding.step = step;
  }

  await onboarding.save();

  /*
  Final Step
  */
  if (step === 4) {

    const details = onboarding.restaurantDetails;

    if (!details?.restaurantName) {
      throw new ApiError("Restaurant name is required");
    }

    await Restaurant.create({
      owner: userId,
      name: details.restaurantName,
      serviceType: onboarding.serviceType,
      address: details.address,
      city: details.city,
      pincode: details.pincode,
      cuisines: details.cuisines,
      images: details.images,
      availability: onboarding.serviceAvailability
    });

    onboarding.completed = true;

    await onboarding.save();

  }

  return onboarding;
};