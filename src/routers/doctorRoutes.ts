import express from "express";
import doctorControllers from "../controllers/doctorControllers";
import { verifyToken } from "../middlewares/verifyToken";
import checkSalerOrAdmin from "../middlewares/checkSalerOrAdmin";
import checkDoctor from "../middlewares/checkDoctor";

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
