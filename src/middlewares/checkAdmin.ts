import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "./verifyToken.ts";

const checkAdmin = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not found!" });
  }
  if (req.user.user.role !== "Admin") {
    return res.status(403).json({ error: "Forbidden request" });
  }
  next();
};

export default checkAdmin;
