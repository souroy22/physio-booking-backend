import { NextFunction, Response } from "express";
import { IGetUserAuthInfoRequest } from "./verifyToken";

const checkSalerOrAdmin = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not found!" });
  }
  if (req.user.user.role === "Saler" || req.user.user.role === "Admin") {
    next();
    return;
  }
  return res.status(403).json({ error: "Forbidden request" });
};

export default checkSalerOrAdmin;
