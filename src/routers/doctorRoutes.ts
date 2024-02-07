import express from "express";
import doctorControllers from "../controllers/doctorControllers.ts";
import { verifyToken } from "../middlewares/verifyToken.ts";
import checkSalerOrAdmin from "../middlewares/checkSalerOrAdmin.ts";
import checkDoctor from "../middlewares/checkDoctor.ts";

const doctorRouters = express.Router();

doctorRouters.put(
  "/schedule-slots",
  verifyToken,
  checkDoctor,
  doctorControllers.scheduleSlots
);
doctorRouters.get(
  "/all",
  verifyToken,
  checkSalerOrAdmin,
  doctorControllers.getAllDoctors
);

export default doctorRouters;
