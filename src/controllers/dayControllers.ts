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

const startTime: number = 5; // 24 hours format
const endTime: number = 23; // 24 hours format
const duration: number = 45; // in minutes

const dayControllers = {
  createSlotsForCurrentWeek: async (req: Request, res: Response) => {
    try {
      const allTimings = [];
      for (const day of days) {
        let newDay = new Day({ day, isHoliday: false });
        newDay = await newDay.save();
        const allSlots = [];
        let hour: number = startTime;
        let minute: number = 0;
        while (hour < endTime || !(hour === 23 && minute === 0)) {
          const startTime = `${hour < 10 ? "0" : ""}${hour}:${
            minute < 10 ? "0" : ""
          }${minute}`;
          const endTimeHour = hour + Math.floor((minute + 45) / 60);
          const endTimeMinute = (minute + duration) % 60;
          const endTime = `${endTimeHour < 10 ? "0" : ""}${endTimeHour}:${
            endTimeMinute < 10 ? "0" : ""
          }${endTimeMinute}`;
          const data = {
            startTime,
            endTime,
            day: newDay._id,
          };
          let slot = new Slot(data);
          slot = await slot.save();
          hour = endTimeHour;
          minute = endTimeMinute;
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
