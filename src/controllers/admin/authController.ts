import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';
import { asyncHandler } from '../../middleware/asyncHandler';
import { error, success } from '../../utils/responses';
import { validateFields } from '../../utils/validation';
import * as adminAuthService from '../../services/admin/adminAuthService';
import { signAdminRefreshToken, signInAdminAcessToken } from '../../services/shared/authService';
import { RoleEnum } from '../../common/commonEnum';


export const login =asyncHandler(async (req:Request, res:Response)=>{
   const {email,password}=req.body;
   console.log("🚀 ~ password:", password)
   console.log("🚀 ~ email:", email)
   if(!email || !password){
     return error(res, {message: 'email, password are required', status: 400});
   }

   const allowed = ['email', 'password'];
   if(!validateFields(req.body, allowed, res)) return;
    
   const user= await adminAuthService.findByKey('email', email);
   if(!user) return error(res, {message: 'Invalid credentials', status: 400});
   
   const match = await user.comparePassword(password);
   if(!match) return error(res, {message: 'Invalid credentials', status: 400});

   // Generate JWT
   const payload = { id: user._id, email: user.email, role: user.role };
   const token = signInAdminAcessToken(payload);
   console.log("🚀 ~ token:", token)
   const refreshToken = signAdminRefreshToken(payload);

   // Save token and FCM token for single-session
   user.activeToken = token;
  //  user.refreshToken = refreshToken;
   
   const returnUser= await user.save();
  //  console.log("🚀 ~ returnUser:", returnUser)

   const modifiedResponse= {
    ...returnUser.toObject(),
    token
   }
   console.log("🚀 ~ modifiedResponse:", modifiedResponse)
   console.log(' 🚀 returnUser is ', returnUser)
  const  isProd=process.env.NODE_ENV==='production'
   res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd ? true : false,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    path: '/',
  });
   return success(res, {
     data: modifiedResponse,
     message: 'Logged in successfully',
     status: 200
   });
})


export const signup=asyncHandler(async(req:Request , res:Response)=>{
  const {email, password, name}=req.body;
  
  if(!email || !password || !name){
    return error(res, {message: 'email, password, name are required', status: 400});
  }
  const allowed = ['email', 'password', 'name'];
  console.log('run over here 1')
  if(!validateFields(req.body, allowed, res)) return;
   console.log('run over here')
  const existing = await adminAuthService.findByEmail(email);
   if (existing) return error(res, { message: 'Email already used', status: 409 });
  const role = RoleEnum.ADMIN
  const user = await User.create({ email, password, name , role });
  console.log("🚀 ~ user:", user)
  return success(res, { data: { user: { id: user._id, email: user.email, name: user.name , role:user.role } }, status: 201, message: 'Registered' });
})




export const refresh=asyncHandler(async(req:Request , res:Response)=>{
  console.log("🚀 ~ req:", req)
    const cookie = req?.cookies.refreshToken;
    console.log("🚀 ~ cookie:", cookie)
    if(!cookie) return error(res, {message: 'No refresh token found', status: 400});
    const user = await adminAuthService.findByKey('refreshToken', cookie);
    if(!user) return error(res, {message: 'Invalid refresh token', status: 400});

    const payload = { id: user._id, email: user.email, role: user.role };
    const newAccessToken = signInAdminAcessToken(payload);

    user.activeToken = newAccessToken;
    const modifiedUser = await user.save();

    return success(res, {
      data: {
        newAccessToken: newAccessToken,
        user: modifiedUser
      },
      message: 'Refreshed successfully'
    });
}
)
