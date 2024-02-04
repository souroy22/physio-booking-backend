import mongoose, { Schema, Types } from "mongoose";

type DayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thusday"
  | "Friday"
  | "Saturday";

interface ISlot extends Document {
  startTime: Number;
  endTime: Number;
  isBooked: boolean;
  day: Types.ObjectId;
  availableDoctor: Types.ObjectId | null;
  bookedBy: Types.ObjectId | null;
  remarks: string;
}

const slotSchema = new mongoose.Schema<ISlot>(
  {
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    day: {
      type: mongoose.Schema.ObjectId,
      ref: "Day",
      required: true,
    },
    availableDoctor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model<ISlot>("Slot", slotSchema);

export default Slot;
