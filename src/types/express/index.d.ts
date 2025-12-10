import { JwtPayload } from "jsonwebtoken";
import { RoleEnum } from "../../common/commonEnum";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      id: Types.ObjectId;
      email: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
      role?: RoleEnum.ADMIN | RoleEnum.USER;
    }
  }
}
