import User from '../../models/User';

export const findByKey = async (key: string, value: any) => {
  const user = await User.findOne({ [key]: value }).select('+password');
  return user;
};

export const findByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};
