import { ObjectSchema } from "joi";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";

export const validateRquest = (schema: ObjectSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new ApiError(
        "Validation failed",
        400,
        error.details.map((d) => d.message),
      ),
    );
  }

  req.body = value;
  next();
};

export const validateCreateOutletRequest = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["menuImages"]) {
        req.body.menuImages = files["menuImages"].map((file) => file.filename);
      }

      if (files["fssaiLicenseDoc"]) {
        req.body.fssaiLicenseDoc = files["fssaiLicenseDoc"][0].filename;
      }
      if (files["panDoc"]) {
        req.body.panDoc = files["panDoc"][0].filename;
      }
      if (files["cancelledChequeDoc"]) {
        req.body.bankDetails = {
          ...req.body.bankDetails,
          cancelledChequeDoc: files["cancelledChequeDoc"][0].filename,
        };
      }
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(
        new ApiError(
          "Validation Failed",
          400,
          error.details.map((d) => d.message),
        ),
      );
    }

    req.body = value;
    next();
  };
};
