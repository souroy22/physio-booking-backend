import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export type USER_TYPE = {
  name: string;
  email: string;
  role: "User" | "Saler" | "Doctor" | "Admin";
  avatar: string | null;
  id: Types.ObjectId;
};

const genarateToken = async (user: USER_TYPE) => {
  const token = await jwt.sign({ user }, process.env.SECRET_KEY || "", {
    expiresIn: "7d",
  });
  return token;
};

export default genarateToken;
