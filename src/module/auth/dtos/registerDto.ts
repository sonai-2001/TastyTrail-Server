// modules/auth/types/auth.types.ts

import { IUser } from "../../../models/user.schema.";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp?: string;
  roles?: ("user" | "res_partner" | "driver" | "admin")[];
}

// dtos/registerResponseDto.ts


export interface RegisterResponse {
  user: IUser;
  accessToken: string;
}