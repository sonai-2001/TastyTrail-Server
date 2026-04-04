import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      // 🔥 Convert Zod error → your format
      console.log("error =====>", err)
      const formattedErrors = err.errors?.map((e: any) => ({
        field: e.path.join("."), // e.g. "email"
        message: e.message,
      }));

      return next(new ApiError("Validation failed", 400, formattedErrors));
    }
  };