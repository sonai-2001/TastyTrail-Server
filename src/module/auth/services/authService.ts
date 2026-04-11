import { Restaurant } from "../../../models/restaurant.schema";
import { User } from "../../../models/user.schema.";
import { ApiError } from "../../../utils/ApiError";
import { generateAccessToken } from "../../../utils/generateJwt";
import { LoginInput, LoginResponse } from "../dtos/loginDto";
import { RegisterInput, RegisterResponse } from "../dtos/registerDto";

export const registerService = async (
  data: RegisterInput
): Promise<RegisterResponse> => {

  const { name, email, phone, password } = data;

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    roles: ["user"] // safer than taking from body
  });

  const accessToken = generateAccessToken(user._id.toString());

  return {
    user,
    accessToken
  };
};



export const loginService = async (
  data: LoginInput
): Promise<LoginResponse> => {

  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id.toString());

  const restaurants = await Restaurant.find({
    owner: user._id
  }).select("name _id")
  let restaurantCount = restaurants.length





  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    restaurantCount,
    restaurants
  };
};