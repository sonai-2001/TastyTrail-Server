import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/shared/authService';
import User from '../models/User';
import { RoleEnum, statusEnum } from '../common/commonEnum';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export async function  requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization as string | undefined;
  if (!header) return res.status(400).json({ success: false, message: 'Missing token' });
  const token = header.split(' ')[1];
  if (!token) return res.status(400).json({ success: false, message: "Missing token" });

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("+activeToken +fcmToken");
    if (!user || user.status===statusEnum.INACTIVE) return res.status(400).json({ success: false, message: "User not found or inactive" });

    // Single-session enforcement
    if (user.activeToken !== token) {
      return res.status(400).json({ success: false, message: "Token invalid or expired" });
    }

    req.user = payload;
    req.role= user.role;
     next();
  } catch (err) {
   if (err instanceof TokenExpiredError) {
      // Token expired → frontend can call /refresh
      return res.status(401).json({ success: false, message: "Token expired", code: "TOKEN_EXPIRED" });
    } else if (err instanceof JsonWebTokenError) {
      // Token invalid
      return res.status(401).json({ success: false, message: "Invalid token", code: "TOKEN_INVALID" });
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.role) return res.status(400).json({ success: false, message: 'Not authenticated' });
  if (req.role !== RoleEnum.ADMIN) return res.status(403).json({ success: false, message: 'Admin only' });
  next();
}
