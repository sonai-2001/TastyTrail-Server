// src/middleware/multerErrorHandler.ts
import multer from "multer";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle Multer-specific errors cleanly.
 * Should be placed right after your upload middleware in the route chain.
 */
export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    let message = "";

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size too large. Maximum allowed size is 2 MB.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field.";
        break;
      default:
        message = "File upload failed.";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Handle custom file type errors from your fileFilter
  if (err.message && err.message.includes("Only image files are allowed")) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Only image files are allowed.",
    });
  }

  // Not a Multer error — pass to global error handler
  next(err);
}
