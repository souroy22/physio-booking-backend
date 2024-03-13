import express, { Router } from "express";
import authControllers from "../controllers/authControllers";
import { verifyToken } from "../middlewares/verifyToken";

const authRouters = express.Router();

authRouters.post("/signin", authControllers.signin);
authRouters.post("/signup", authControllers.signup);
authRouters.get("/signout", verifyToken, authControllers.signout);

export default authRouters;
