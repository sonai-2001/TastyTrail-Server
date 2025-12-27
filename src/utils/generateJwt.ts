import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (userId: string, role: string) => {
  const payload: JwtPayload = { userId, role };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d" // token validity
  });

  return token;
};
