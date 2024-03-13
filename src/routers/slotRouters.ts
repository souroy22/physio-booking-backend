import express, { Request, Response } from "express";
import slotControllers from "../controllers/slotControllers";
import { verifyToken } from "../middlewares/verifyToken";
import checkDoctor from "../middlewares/checkDoctor";
import Slot from "../models/slotModel";
import { daywiseFormatData } from "../utils/dayWiseFormatData";

const slotRouters = express.Router();

slotRouters.get(
  "/available-slots",
  verifyToken,
  slotControllers.getAvailableSlots
);

slotRouters.get("/all", async (req: Request, res: Response) => {
  const slots = await Slot.find(
    {},
    { startTime: 1, endTime: 1, day: 1 }
  ).populate({ path: "day", select: "day" });
  const newFormat = daywiseFormatData(slots);
  return res.status(200).json(newFormat);
});

slotRouters.get(
  "/unscheduled-slots",
  verifyToken,
  checkDoctor,
  slotControllers.getUnScheduledSlots
);

slotRouters.get(
  "/get-my-slots",
  verifyToken,
  checkDoctor,
  slotControllers.getSlotsBasedOnDoctor
);

slotRouters.put("/book-slot", verifyToken, slotControllers.bookSlot);

slotRouters.get("/appointments/:id", verifyToken, slotControllers.getUserSlot);

export default slotRouters;
