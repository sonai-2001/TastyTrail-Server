import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as restaurantService from "../services/restaurant.service";

export const getMyRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user!.id.toString();
  const restaurants = await restaurantService.getPartnerRestaurants(userId);
  return success(res, { message: "Partner restaurants fetched successfully", data: { restaurants } });
});

export const updateRestaurantSettings = asyncHandler(async (req, res) => {
  // Logic to update settings like availability/images
  return success(res, { message: "Restaurant settings updated successfully" });
});

export const getRestaurantsController = asyncHandler(async (req, res) => {

  const userId = req.user!.id.toString();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const status =
    (req.query.status as "all" | "active" | "inactive") || "all";

  const result = await restaurantService.getRestaurantsService(
    userId,
    page,
    limit,
    status
  );

  success(res, {
    data: result.restaurants,
    meta: result.meta
  });

});
