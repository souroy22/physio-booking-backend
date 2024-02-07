import { Request, Response } from "express";
import User from "../models/userModel.ts";
import Slot from "../models/slotModel.ts";

const doctorControllers = {
  scheduleSlots: async (req: Request, res: Response) => {
    try {
      const { id, data }: { id: string; data: string[] } = req.body;
      if (!(id && data)) {
        return res.status(400).json({ error: "Provide all valid details" });
      }
      const doctor = await User.findOne({ _id: id, role: "Doctor" });
      if (!doctor) {
        return res.status(400).json({ error: "Invalid doctor" });
      }
      for (const slotId of data) {
        await Slot.findByIdAndUpdate(
          slotId,
          { $push: { availableDoctors: id } },
          { new: true }
        );
      }
      return res.status(200).json({ msg: "Successfully scheduled slots!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllDoctors: async (req: Request, res: Response) => {
    try {
      const doctors = await User.find({ role: "Doctor" }).select({
        name: 1,
      });
      return res.status(200).json(doctors);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Simething went wrong" });
      }
    }
  },
};

export default doctorControllers;
