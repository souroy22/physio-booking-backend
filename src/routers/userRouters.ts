import express from "express";
import userControllers from "../controllers/userControllers.ts";
import { verifyToken } from "../middlewares/verifyToken.ts";
import checkSalesPerson from "../middlewares/checkSales.ts";
import multer from "multer";

const upload = multer();

const userRouters = express.Router();

userRouters.get("/get-user", verifyToken, userControllers.getUserData);
userRouters.post(
  "/get-user-by-mailid",
  verifyToken,
  checkSalesPerson,
  userControllers.getUserByMailId
);
userRouters.put(
  "/update/:id",
  // verifyToken,
  upload.single("avatar"),
  userControllers.editUserData
);

export default userRouters;
