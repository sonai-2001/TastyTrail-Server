import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as restaurantService from "../services/restaurant.service";

export const getPickupLocationDetail = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const restaurant = await restaurantService.getRestaurantById(id);
  // Pick specific address fields for driver
  const { name, address, city, pincode } = restaurant;
  return success(res, { message: "Pickup location fetched successfully", data: { name, address, city, pincode } });
});
