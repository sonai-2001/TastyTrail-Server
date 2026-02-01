import Joi from "joi";
import { ServiceTypeEnum } from "../../common/commonEnum";
import mongoose from "mongoose";

const isValidObjectId = (value: any, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createOutletSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  serviceType: Joi.string()
    .valid(...Object.values(ServiceTypeEnum))
    .required(),

  address: Joi.object({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().default("India"),
    pincode: Joi.string()
      .pattern(/^[1-9][0-9]{5}$/) // Validates Indian Pincodes
      .required()
      .messages({ "string.pattern.base": "Please provide a valid 6-digit pincode" }),
  }).required(),

  location: Joi.object({
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2).required().messages({ "array.length": "Coordinates must be [longitude, latitude]" }),
  }).required(),

  // Nested Contact Object
  contact: Joi.object({
    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({ "string.pattern.base": "Invalid phone number" }),
    email: Joi.string().email().lowercase().optional(),
  }).required(),

  // Legal & Documents
  gstNumber: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .allow("", null)
    .message("Invalid GST format"),
  fssaiLicenseNumber: Joi.string().length(14).required(),
  fssaiLicenseDoc: Joi.string().required().messages({
    "any.required": "FSSAI License document is mandatory",
    "string.empty": "FSSAI License file path cannot be empty",
  }),
  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .uppercase()
    .required(),
  panDoc: Joi.string().required(),
  cousineType: Joi.string().custom(isValidObjectId).required().messages({
    "any.invalid": "Invalid Cuisine Type ID format",
    "any.required": "Cuisine type is required",
  }),

  menuImages: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.min": "At least one menu image is required",
    "any.required": "Menu images are required",
  }),

  bankDetails: Joi.object({
    accountHolderName: Joi.string().required(),
    bankName: Joi.string().required(),
    accountNumber: Joi.string()
      .pattern(/^\d{9,18}$/)
      .required(),
    ifscCode: Joi.string()
      .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .required(),
    cancelledChequeDoc: Joi.string().required(),
  }).required(),
});
