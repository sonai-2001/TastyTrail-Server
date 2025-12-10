import User, { IUser } from "../../models/User";

export async function createUser(payload: Partial<IUser>) {
  const user = new User(payload);
  await user.save();
  return user;
}

export async function findByEmail(email: string) {
  return User.findOne({ email }).select('+password');
}

export async function findById(id: string) {
  return User.findById(id);
}

// Find user by reset token
export async function findByResetToken(token: string) {
  return User.findOne({ resetPasswordToken: token }) .select('+resetPasswordToken +resetPasswordExpires');;
}
