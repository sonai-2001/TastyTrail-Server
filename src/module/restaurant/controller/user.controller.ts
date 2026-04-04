import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as restaurantService from "../services/restaurant.service";

export const getAllRestaurantsList = asyncHandler(async (req, res) => {
  const restaurants = await restaurantService.getAllRestaurants();
  return success(res, { message: "Restaurants listed successfully", data: { restaurants } });
});

export const getSingleRestaurantDetail = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const restaurant = await restaurantService.getRestaurantById(id);
  return success(res, { message: "Restaurant details fetched successfully", data: { restaurant } });
});
