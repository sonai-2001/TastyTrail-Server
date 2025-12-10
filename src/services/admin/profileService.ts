import User from "../../models/User";

export const findById = async (id: string) => {
  const user = await User.findById(id)
  return user;
};