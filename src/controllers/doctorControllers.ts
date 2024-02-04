import { Request, Response } from "express";
import User from "../models/userModel.ts";
import Slot from "../models/slotModel.ts";

const doctorControllers = {
  scheduleSlots: async (req: Request, res: Response) => {
    try {
      const { id, data }: { id: string; data: any } = req.body;
      if (!(id && data)) {
        return res.status(400).json({ error: "Provide all valid details" });
      }
      const doctor = await User.findOne({ _id: id, role: "Doctor" });
      if (!doctor) {
        return res.status(400).json({ error: "Invalid doctor" });
      }
      const allData: any = Object.entries(data);
      for (const [key, value] of allData) {
        for (const time of value) {
          await Slot.findByIdAndUpdate(
            time,
            { availableDoctor: id, day: key },
            { new: true }
          );
        }
      }
      return res.status(200).json({ msg: "Successfully scheduled slots!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getDoctors: async (req: Request, res: Response) => {
    try {
      let doctors: any = await User.find({ role: "Doctor" }).select({
        id: 1,
        name: 1,
        email: 1,
        avatar: 1,
      });
      doctors = doctors.map((doctor: any) => {
        const newDoctor = {
          name: doctor.name,
          id: doctor._id,
          email: doctor.email,
          avatar: doctor.avatar,
        };
        return newDoctor;
      });
      return res.status(200).json(doctors);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default doctorControllers;
