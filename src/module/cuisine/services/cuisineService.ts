import { Cuisine, ICuisine } from "../../../models/cuisine.schema";
import { ApiError } from "../../../utils/ApiError";

export const createCuisine = async (data: Partial<ICuisine>) => {
  const existing = await Cuisine.findOne({ name: data.name });
  if (existing) {
    throw new ApiError("Cuisine already exists", 400);
  }
  return await Cuisine.create(data);
};

export const getAllCuisines = async (onlyActive = false) => {
  const filter = onlyActive ? { isActive: true } : {};
  return await Cuisine.find(filter).sort({ name: 1 });
};

export const updateCuisine = async (id: string, data: Partial<ICuisine>) => {
  const cuisine = await Cuisine.findByIdAndUpdate(id, data, { new: true });
  if (!cuisine) {
    throw new ApiError("Cuisine not found", 404);
  }
  return cuisine;
};

export const deleteCuisine = async (id: string) => {
  const cuisine = await Cuisine.findByIdAndDelete(id);
  if (!cuisine) {
    throw new ApiError("Cuisine not found", 404);
  }
  return cuisine;
};
