import express from "express";
import authRouters from "./authRouters.js";
import doctorRouters from "./doctorRoutes";
import dayRouters from "./dayRouters";
import slotRouters from "./slotRouters";
import userRouters from "./userRouters";

const router = express.Router();

router.use("/auth", authRouters);
router.use("/doctor", doctorRouters);
router.use("/day", dayRouters);
router.use("/slot", slotRouters);
router.use("/user", userRouters);

export default router;
