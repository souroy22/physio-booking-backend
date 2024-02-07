import express from "express";
import { verifyToken } from "../middlewares/verifyToken.ts";
import dayControllers from "../controllers/dayControllers.ts";
import checkAdmin from "../middlewares/checkAdmin.ts";

const dayRouters = express.Router();

dayRouters.get(
  "/create-timing",
  // verifyToken,
  // checkAdmin,
  dayControllers.createSlotsForCurrentWeek
);

export default dayRouters;
