import express from "express";
import slotControllers from "../controllers/slotControllers.ts";
import { verifyToken } from "../middlewares/verifyToken.ts";
import checkDoctor from "../middlewares/checkDoctor.ts";

const slotRouters = express.Router();

slotRouters.get(
  "/available-slot",
  verifyToken,
  slotControllers.getAvailableSlots
);

slotRouters.get(
  "/unschedule-slots",
  verifyToken,
  checkDoctor,
  slotControllers.getUnScheduledSlots
);

slotRouters.put("/book-slot", verifyToken, slotControllers.bookSlot);

slotRouters.get("/appointments/:id", verifyToken, slotControllers.getUserSlot);

export default slotRouters;
