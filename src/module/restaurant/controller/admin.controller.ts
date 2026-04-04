import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as restaurantService from "../services/restaurant.service";

export const approveRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const restaurant = await restaurantService.updateRestaurantStatus(id, true);
  return success(res, { message: "Restaurant approved successfully", data: { restaurant } });
});

export const removeRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const restaurant = await restaurantService.updateRestaurantStatus(id, false);
  return success(res, { message: "Restaurant removed successfully", data: { restaurant } });
});
