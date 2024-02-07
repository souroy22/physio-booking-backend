import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: Buffer | null;
  role: "User" | "Saler" | "Doctor" | "Admin";
  verified: boolean;
  address: string;
  phone: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Buffer || null,
      default: null,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Saler", "Doctor", "Admin"],
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  return next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
