import { NextFunction, Response } from "express";
import { IGetUserAuthInfoRequest } from "./verifyToken.ts";

const checkSalerOrAdmin = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not found!" });
  }
  console.log("User", req.user.user);
  if (req.user.user.role === "Saler" || req.user.user.role === "Admin") {
    next();
    return;
  }
  return res.status(403).json({ error: "Forbidden request" });
};

export default checkSalerOrAdmin;
