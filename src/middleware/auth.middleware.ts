import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { RoleEnum, UserEnum } from "../common/commonEnum";
import { User } from "../models/user.schema.";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Authorization token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    let decoded: jwt.JwtPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string };
    } catch {
      throw new ApiError("Invalid or expired token", 401);
    }

    const user = await User.findById(decoded.userId).select("_id email roles");

    if (!user) {
      throw new ApiError("User not found", 401);
    }

    // if (user.status !== UserEnum.ACTIVE) {
    //   throw new ApiError("User is not active", 403);
    // }

    req.user = {
      id: user._id,
      email: user.email,
      roles:user.roles
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError("Unauthorized", 401));
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return next(new ApiError("Forbidden: insufficient permissions", 403));
    }

    next();
  };
