import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { RoleEnum, UserEnum } from "../common/commonEnum";
import { User } from "../models/user";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Authorization token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    let decoded: jwt.JwtPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { id: string };
    } catch {
      throw new ApiError("Invalid or expired token", 401);
    }

    const user = await User.findById(decoded.userId).select("_id email activeRole status");

    if (!user) {
      throw new ApiError("User not found", 401);
    }

    if (user.status !== UserEnum.ACTIVE) {
      throw new ApiError("User is not active", 403);
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.activeRole as RoleEnum,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...allowedRoles: RoleEnum[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError("Forbidden: insufficient permissions", 403));
    }

    next();
  };
