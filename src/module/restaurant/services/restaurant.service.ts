import { Types } from "mongoose";
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


interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getRestaurantsByUser = async (
  userId: Types.ObjectId,
  { page = 1, limit = 10 }: PaginationParams
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  const skip = (page - 1) * limit;

  const query = {
    owner: userId
    // ❌ no isActive filter (as you requested)
  };

  const [restaurants, totalDocs] = await Promise.all([
    Restaurant.find(query)
      .populate("cuisines") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Restaurant.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  const meta = {
    totalDocs,
    skip,
    page,
    limit,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null
  };

  return {
    data: restaurants,
    meta
  };
};

export const getRestaurantsService = async (
  userId: string,
  page = 1,
  limit = 10,
  status: "all" | "active" | "inactive" = "all"
) => {

  const query: any = {
    owner: userId
  };

  if (status === "active") {
    query.isActive = true;
  }

  if (status === "inactive") {
    query.isActive = false;
  }

  const skip = (page - 1) * limit;

  const restaurants = await Restaurant.find(query)
    .select("_id name city isActive rating")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Restaurant.countDocuments(query);

  const totalPages = Math.ceil(total / limit);

  return {
    restaurants,
    meta: {
      totalDocs: total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      skip
    }
  };
};
