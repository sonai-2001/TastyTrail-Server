import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  // Implement login logic here
});