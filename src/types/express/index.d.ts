import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { RoleEnum } from "../../common/commonEnum";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      id: Types.ObjectId;
      email: string;
      role: RoleEnum;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

