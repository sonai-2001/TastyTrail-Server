import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../../models/User';
import { RoleEnum } from '../../common/commonEnum';

export type tokenPayload={
  id: string;
  email: string;
  role: RoleEnum.ADMIN | RoleEnum.USER | undefined;

}

export function signToken(payload: tokenPayload) {
  return jwt.sign(payload as any, process.env.JWT_SECRET as string,  {
        expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"], // ✅ correct typing
      });
}

export const signInAdminAcessToken=(payload:tokenPayload)=>{
   return jwt.sign(payload as any , process.env.JWT_SECRET as string , {
    expiresIn : process.env.JWT_ACCESS_ADMIN_EXPIRES_IN as SignOptions["expiresIn"], // ✅ correct typing
   })
}

export const signAdminRefreshToken=(payload:tokenPayload)=>{
     return jwt.sign(payload as any , process.env.JWT_SECRET as string , {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"], // ✅ correct typing
     })
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as any;
}

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export function comparePassword(candidate: string, pw: string) {
   console.log(pw)
}


// comparePassword('12',2)
