import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "./verifyToken.ts";

const checkDoctor = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not found!" });
  }

  if (req.user.user.role !== "Doctor") {
    return res.status(403).json({ error: "Forbidden request" });
  }
  // if (!req.user.user.verified) {
  //   return res.status(403).json({ error: "You are not verified yet" });
  // }
  next();
};

export default checkDoctor;
