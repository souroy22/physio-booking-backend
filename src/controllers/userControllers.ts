import { Request, Response } from "express";
import User from "../models/userModel.ts";

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
};

export default userControllers;
