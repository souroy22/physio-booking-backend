import express from "express";
import authRouters from "./authRouters.js";
import doctorRouters from "./doctorRoutes.ts";
import dayRouters from "./dayRouters.ts";
import slotRouters from "./slotRouters.ts";
import userRouters from "./userRouters.ts";

const router = express.Router();

router.use("/auth", authRouters);
router.use("/doctor", doctorRouters);
router.use("/day", dayRouters);
router.use("/slot", slotRouters);
router.use("/user", userRouters);

export default router;
