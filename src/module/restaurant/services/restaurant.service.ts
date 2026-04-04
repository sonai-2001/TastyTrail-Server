import { Restaurant } from "../../../models/restaurant.schema";
import { ApiError } from "../../../utils/ApiError";

export const getAllRestaurants = async () => {
  return await Restaurant.find({ isActive: true });
};

export const getRestaurantById = async (id: string) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError("Restaurant not found", 404);
  return restaurant;
};

export const updateRestaurantStatus = async (id: string, isActive: boolean) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!restaurant) throw new ApiError("Restaurant not found", 404);
  return restaurant;
};

export const getPartnerRestaurants = async (ownerId: string) => {
  return await Restaurant.find({ owner: ownerId });
};
