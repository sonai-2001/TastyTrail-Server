import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import * as cuisineService from "../services/cuisineService";

export const createCuisine = asyncHandler(async (req, res) => {
  const result = await cuisineService.createCuisine(req.body);
  return success(res, {
    data: result,
    message: "Cuisine created successfully",
    status: 201
  });
});

export const getAllCuisines = asyncHandler(async (req, res) => {
  const onlyActive = req.query.active === 'true';
  const result = await cuisineService.getAllCuisines(onlyActive);
  return success(res, {
    data: result,
    message: "Cuisines fetched successfully"
  });
});

export const updateCuisine = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const result = await cuisineService.updateCuisine(id, req.body);
  return success(res, {
    data: result,
    message: "Cuisine updated successfully"
  });
});

export const deleteCuisine = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  await cuisineService.deleteCuisine(id);
  return success(res, {
    message: "Cuisine deleted successfully"
  });
});
