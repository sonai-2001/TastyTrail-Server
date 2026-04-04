import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as restaurantService from "../services/restaurant.service";

export const getMyRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user?.id?.toString();
  const restaurants = await restaurantService.getPartnerRestaurants(userId as string);
  return success(res, { message: "Partner restaurants fetched successfully", data: { restaurants } });
});

export const updateRestaurantSettings = asyncHandler(async (req, res) => {
  // Logic to update settings like availability/images
  return success(res, { message: "Restaurant settings updated successfully" });
});
