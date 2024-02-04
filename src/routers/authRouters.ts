import express, { Router } from "express";
import authControllers from "../controllers/authControllers.ts";
import { verifyToken } from "../middlewares/verifyToken.ts";

const authRouters = express.Router();

authRouters.post("/signin", authControllers.signin);
authRouters.post("/signup", authControllers.signup);
authRouters.get("/signout", verifyToken, authControllers.signout);

export default authRouters;
