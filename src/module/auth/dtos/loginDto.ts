import { IUser } from "../../../models/user.schema.";

export interface LoginInput {
  email: string;
  password: string;
}


export interface LoginResponse {
  user: IUser;
  accessToken: string;
}