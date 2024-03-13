import { Request, Response } from "express";
import Day from "../models/dayModel";
import Slot from "../models/slotModel";

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
const gap: number = 15; // gap in between every slot

const dayControllers = {
  createSlotsForCurrentWeek: async (req: Request, res: Response) => {
    try {
      const allTimings: any = [];
      for (const day of days) {
        let newDay = new Day({ day, isHoliday: false });
        newDay = await newDay.save();
        const allSlots = [];
        let hour = startTime;
        let minute = 0;
        while (!(hour === endTime && minute === 0)) {
          const startTimeFormatted = `${hour < 10 ? "0" : ""}${hour}:${
            minute < 10 ? "0" : ""
          }${minute}`;

          // Calculate end time
          let endTimeHour = hour;
          let endTimeMinute = minute + duration;
          if (endTimeMinute >= 60) {
            endTimeHour += Math.floor(endTimeMinute / 60);
            endTimeMinute %= 60;
          }
          const endTimeFormatted = `${
            endTimeHour < 10 ? "0" : ""
          }${endTimeHour}:${endTimeMinute < 10 ? "0" : ""}${endTimeMinute}`;

          const data = {
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            day: newDay._id,
          };

          // Move to next time slot
          minute += gap;
          if (minute >= 60) {
            minute %= 60;
            hour++;
          }
          let slot = new Slot(data);
          slot = await slot.save();
          // hour = endTimeHour;
          // minute = endTimeMinute;
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
