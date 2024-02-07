import { Request, Response } from "express";
import Slot from "../models/slotModel.ts";
import { daywiseFormatData } from "../utils/dayWiseFormatData.ts";
import Appointments from "../models/appointmentModel.ts";
import { formatTime } from "../utils/getTime.ts";

interface IQuery {
  day?: "Monday" | "Tuesday" | "Wednesday" | "Thusday" | "Friday" | "Saturday";
  timing?: "Morning" | "After_Noon" | "Evening";
  doctorId?: string;
}

const timings = {
  Morning: { startTime: "5:00", endTime: "12:00" },
  After_Noon: { startTime: "12:00", endTime: "16:00" },
  Evening: { startTime: "16:00", endTime: "23:00" },
};

type Match1Type = {
  startTime?: any;
  endTime?: any;
  availableDoctors?: any;
};

type Match2Type = {
  day?: string;
};

const slotControllers = {
  getAvailableSlots: async (req: Request, res: Response) => {
    try {
      const { day, timing, doctorId }: IQuery = req.query;
      const match1: Match1Type = {};
      let totalStartMinutes;
      let totalEndMinutes;
      if (timing) {
        const t = timings[timing];
        totalStartMinutes = formatTime(t.startTime);
        totalEndMinutes = formatTime(t.endTime);
      } else {
        totalStartMinutes = formatTime("5:00");
        totalEndMinutes = formatTime("23:00");
      }
      if (doctorId) {
        match1["availableDoctors"] = doctorId;
      } else {
        match1["availableDoctors"] = { $ne: null };
      }
      const match2: Match2Type = {};
      if (day) {
        match2["day"] = day;
      }
      let allSlots = await Slot.aggregate([
        {
          $project: {
            startTime: 1,
            endTime: 1,
            day: 1,
            availableDoctors: 1,
            startMinutes: {
              $add: [
                {
                  $multiply: [
                    { $toInt: { $substr: ["$startTime", 0, 2] } },
                    60,
                  ],
                },
                { $toInt: { $substr: ["$startTime", 3, 2] } },
              ],
            },
            endMinutes: {
              $add: [
                {
                  $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60],
                },
                { $toInt: { $substr: ["$endTime", 3, 2] } },
              ],
            },
          },
        },
        {
          $match: {
            startMinutes: { $gte: totalStartMinutes },
            endMinutes: { $lte: totalEndMinutes },
            availableDoctors: { $ne: [] },
          },
        },
        {
          $lookup: {
            from: "days",
            localField: "day",
            foreignField: "_id",
            as: "day",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "availableDoctors",
            foreignField: "_id",
            as: "availableDoctors",
          },
        },
        {
          $unwind: "$day",
        },
        {
          $addFields: {
            day: { day: "$day.day" },
            availableDoctors: {
              $map: {
                input: "$availableDoctors",
                as: "doctor",
                in: "$$doctor.name",
              },
            },
            startTime: "$startTime",
            endTime: "$endTime",
          },
        },
      ]);
      console.log("allSlots", allSlots[0]);

      const allAvailableSlots: any = [];
      if (!doctorId) {
        for (const slot of allSlots) {
          for (const doctor of slot.availableDoctors) {
            if (
              !allAvailableSlots.filter((Aslot: any) => Aslot._id === slot._id)
                .length
            ) {
              const isAvailable = await Appointments.findOne({
                doctor: { $ne: doctor._id },
                slot: { $ne: slot._id },
              });
              if (!isAvailable) {
                allAvailableSlots.push(slot);
              }
            }
          }
        }
      } else {
        for (const slot of allSlots) {
          const isAvailable = await Appointments.findOne({
            doctor: { $ne: doctorId },
            slot: { $ne: slot._id },
          });
          if (!isAvailable) {
            allAvailableSlots.push(slot);
          }
        }
      }
      // allSlots = allSlots.filter((s) => s.day && !(s.day as any).isHoliday);
      // console.log("allAvailableSlots", allAvailableSlots);

      const newFormat: any = daywiseFormatData(allAvailableSlots);
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
      const { id } = req.user.user;
      console.log("ID ---", id);
      const slots = await Slot.find({ availableDoctors: { $nin: [id] } })
        .select({
          _id: 1,
          startTime: 1,
          endTime: 1,
          day: 1,
        })
        .populate("day", { _id: 1, day: 1 })
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
      const { slotId, bookedBy, remarks, doctorId } = req.body;
      if (!(slotId && bookedBy && remarks)) {
        return res
          .status(400)
          .json({ error: "Please provide all required details" });
      }
      console.log("Slot ID", slotId);
      let newAppointment = new Appointments({
        slot: slotId,
        doctor: doctorId,
        patient: bookedBy,
        remarks,
      });
      newAppointment = await newAppointment.save();
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
      const slots = await Appointments.find({ patient: id })
        .select({ slot: 1, doctor: 1, patient: 1, remarks: 1, _id: 0 })
        .populate("doctor", { name: 1, _id: 0 })
        .populate({
          path: "slot",
          select: "startTime endTime day -_id",
          populate: {
            path: "day",
            select: "day -_id",
          },
        });

      return res.status(200).json(slots);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  getSlotsBasedOnDoctor: async (req: Request, res: Response) => {
    try {
      const { id } = req.user.user;
      const slots = await Slot.find({ availableDoctors: { $in: [id] } })
        .select({
          _id: 1,
          startTime: 1,
          endTime: 1,
          day: 1,
        })
        .populate("day", { _id: 1, day: 1 })
        .exec();
      const allSlots = slots.filter((s) => s.day && !(s.day as any).isHoliday);
      const newFormattedData: any = daywiseFormatData(allSlots);
      return res.status(200).json(newFormattedData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default slotControllers;
