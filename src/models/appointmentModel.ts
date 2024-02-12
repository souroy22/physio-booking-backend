import mongoose, { Types } from "mongoose";

interface IDay extends Document {
  doctor: Types.ObjectId;
  slot: Types.ObjectId;
  patient: Types.ObjectId;
  remarks: string;
}

const appointmentSchema = new mongoose.Schema<IDay>(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    slot: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Slot",
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    remarks: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointments = mongoose.model<IDay>("Appointments", appointmentSchema);

export default Appointments;
