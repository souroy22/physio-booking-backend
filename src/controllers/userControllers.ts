import { Request, Response } from "express";
import User from "../models/userModel.ts";

type DATA_TYPE = {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  avatar?: Buffer | null;
};

const userControllers = {
  getUserData: async (req: Request, res: Response) => {
    try {
      const user = req.user.user;
      return res.status(200).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  getUserByMailId: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Please provide email id" });
      }
      const user = await User.findOne({ email }).select({ _id: 1 });
      if (!user) {
        return res.status(200).json({ msg: "No user found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
  editUserData: async (req: Request, res: Response) => {
    try {
      const { name, email, phone, address }: DATA_TYPE = req.body;
      let avatar = null;
      if (req.file && req.file.buffer) {
        avatar = req.file.buffer;
      }
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Please provide the id" });
      }
      const allData: DATA_TYPE = { name, email, phone, address, avatar };
      const updateData: any = {};
      for (const [key, value] of Object.entries(allData)) {
        if (value && value !== null) {
          updateData[key] = value;
        }
      }
      const updatedUser = User.findOneAndUpdate({ email }, updateData, {
        new: true,
      }).select({ name: 1, email: 1, address: 1, phone: 1, avatar: 1, _id: 0 });
      return res.status(200).json({ user: updateData });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default userControllers;
