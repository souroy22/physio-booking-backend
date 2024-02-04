import mongoose from "mongoose";

type DayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thusday"
  | "Friday"
  | "Saturday";

interface IDay extends Document {
  day: DayType;
  isHoliday: boolean;
}

const daySchema = new mongoose.Schema<IDay>(
  {
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"],
    },
    isHoliday: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Day = mongoose.model<IDay>("Day", daySchema);

export default Day;
