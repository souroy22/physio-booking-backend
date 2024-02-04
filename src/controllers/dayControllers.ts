import { Request, Response } from "express";
import Day from "../models/dayModel.ts";
import Slot from "../models/slotModel.ts";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thusday",
  "Friday",
  "Saturday",
];

const startTime = 9; // 24 hours format
const endTime = 20; // 24 hours format
const duration = 1; // in hour

const dayControllers = {
  createSlotsForCurrentWeek: async (req: Request, res: Response) => {
    try {
      const allTimings = [];
      for (const day of days) {
        let newDay = new Day({ day, isHoliday: false });
        newDay = await newDay.save();
        const allSlots = [];
        for (let i = startTime; i < endTime; i++) {
          const data = {
            startTime: i,
            endTime: i + 1,
            isBooked: false,
            day: newDay._id,
            availableDoctor: null,
            bookedBy: null,
          };
          let slot = new Slot(data);
          slot = await slot.save();
          allSlots.push({ startTime: slot.startTime, endTime: slot.endTime });
        }
        allTimings.push({ day: newDay.day, slots: allSlots });
      }
      return res.status(200).json({ timings: allTimings });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default dayControllers;
