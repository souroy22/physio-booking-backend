import { Request, Response } from "express";
import Slot from "../models/slotModel.ts";
import { daywiseFormatData } from "../utils/datWiseFormatData.ts";

interface IQuery {
  day?: "Monday" | "Tuesday" | "Wednesday" | "Thusday" | "Friday" | "Saturday";
  timing?: "Morning" | "After_Noon" | "Evening";
  id?: string;
}

const timings = {
  Morning: { startTime: { $gte: 9 }, endTime: { $lte: 12 } },
  After_Noon: { startTime: { $gte: 12 }, endTime: { $lte: 16 } },
  Evening: { startTime: { $gte: 16 }, endTime: { $lte: 20 } },
};

type Match1Type = {
  isBooked: false;
  startTime?: any;
  endTime?: any;
  availableDoctor?: any;
};

type Match2Type = {
  isHoliday: boolean;
  day?: string;
};

const slotControllers = {
  getAvailableSlots: async (req: Request, res: Response) => {
    try {
      const { day, timing, id }: IQuery = req.query;
      const match1: Match1Type = { isBooked: false };
      if (timing) {
        const t = timings[timing];
        match1["startTime"] = t.startTime;
        match1["endTime"] = t.endTime;
      }
      if (id) {
        match1["availableDoctor"] = id;
      } else {
        match1["availableDoctor"] = { $ne: null };
      }

      const match2: Match2Type = { isHoliday: false };
      if (day) {
        match2["day"] = day;
      }

      let allSlots = await Slot.find(match1)
        .populate({
          path: "day",
          match: match2,
        })
        .exec();
      allSlots = allSlots.filter((s) => s.day && !(s.day as any).isHoliday);
      const newFormat: any = daywiseFormatData(allSlots);
      return res.status(200).json({ slots: newFormat });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  getUnScheduledSlots: async (req: Request, res: Response) => {
    try {
      const slots = await Slot.find({ availableDoctor: null })
        .select({
          _id: 1,
          startTime: 1,
          endTime: 1,
          day: 1,
        })
        .populate("day")
        .select({ _id: 1, day: 1 })
        .exec();
      const allSlots = slots.filter((s) => s.day && !(s.day as any).isHoliday);
      const newFormat: any = daywiseFormatData(allSlots);
      return res.status(200).json(newFormat);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  bookSlot: async (req: Request, res: Response) => {
    try {
      const { slotId, bookedBy, remarks } = req.body;
      if (!(slotId && bookedBy && remarks)) {
        return res
          .status(400)
          .json({ error: "Please provide all required details" });
      }
      await Slot.findByIdAndUpdate(
        slotId,
        {
          isBooked: true,
          bookedBy,
          remarks,
        },
        { new: true }
      );
      return res.status(200).json({ msg: "Booked successfull!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  getUserSlot: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const slots = await Slot.find({ bookedBy: id })
        .select({
          startTime: 1,
          endTime: 1,
          day: 1,
          availableDoctor: 1,
          remarks: 1,
        })
        .populate("availableDoctor", { name: 1, _id: 0 })
        .populate("day", { day: 1, _id: 0 });
      return res.status(200).json(slots);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default slotControllers;
