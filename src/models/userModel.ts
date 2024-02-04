import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  role: "User" | "Saler" | "Doctor" | "Admin";
  verified: boolean;
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
      type: String || null,
      default: null,
    },
    role: {
      type: String,
      required: true,
      default: "User",
      enum: ["User", "Saler", "Doctor", "Admin"],
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
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
