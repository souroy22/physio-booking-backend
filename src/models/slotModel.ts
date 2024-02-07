import mongoose, { Schema, Types } from "mongoose";

type DayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thusday"
  | "Friday"
  | "Saturday";

interface ISlot extends Document {
  startTime: string;
  endTime: string;
  day: Types.ObjectId;
  availableDoctors: Types.ObjectId[];
}

const slotSchema = new mongoose.Schema<ISlot>(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    day: {
      type: mongoose.Schema.ObjectId,
      ref: "Day",
      required: true,
    },
    availableDoctors: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model<ISlot>("Slot", slotSchema);

export default Slot;
