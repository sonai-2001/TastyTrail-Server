import { Response } from "express";
import { error } from "./responses";

/**
 * Checks if the request body contains only allowed fields.
 * @param body - req.body object
 * @param allowedFields - array of allowed field names
 * @param res - Express Response object (used to send error)
 * @returns true if valid, otherwise sends error response
 */
export function validateFields(body: Record<string, any>, allowedFields: string[], res: Response): boolean {
  const keys = Object.keys(body);
  const extraFields = keys.filter(key => !allowedFields.includes(key));

  if (extraFields.length > 0) {
    error(res, {
      message: `Invalid fields: ${extraFields.join(", ")}`,
      status: 400
    });

    
    return false;
  }

  return true;
}
