import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import dayControllers from "../controllers/dayControllers";
import checkAdmin from "../middlewares/checkAdmin";

const dayRouters = express.Router();

dayRouters.get(
  "/create-timing",
  // verifyToken,
  // checkAdmin,
  dayControllers.createSlotsForCurrentWeek
);

export default dayRouters;
