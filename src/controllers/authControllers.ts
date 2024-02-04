import { Request, Response } from "express";
import User from "../models/userModel.ts";
import getUserData from "../utils/getUser.ts";
import verifyPassword from "../utils/verifyPassword.ts";
import genarateToken, { USER_TYPE } from "../utils/genarateToken.ts";
import destroyToken from "../utils/destroyToken.ts";

const authControllers = {
  signup: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = "User", avatar = null } = req.body;
      if (role === "Admin") {
        return res.status(403).json({ error: "Forbidden request" });
      }
      if (!(name && email && password)) {
        return res.status(400).json({ error: "Please fill all the details" });
      }
      const isExist = await getUserData(email);
      if (isExist !== null) {
        return res
          .status(400)
          .json({ error: "This mail id is already exist." });
      }
      let newUser = new User({ name, email, password, role, avatar });
      newUser = await newUser.save();
      const user: USER_TYPE = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar || null,
        id: newUser._id,
      };
      const token = await genarateToken(user);
      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).json({ error: "Please fill all the details" });
      }
      const isExist = await getUserData(email);
      if (isExist === null) {
        return res.status(400).json({ error: "This mailid doen't exists" });
      }
      if (!verifyPassword(password, isExist.password)) {
        return res
          .status(401)
          .json({ error: "EmailId or password doesn't match" });
      }
      const user: USER_TYPE = {
        name: isExist.name,
        email: isExist.email,
        role: isExist.role,
        avatar: isExist.avatar || null,
        id: isExist._id,
      };
      const token = await genarateToken(user);
      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signout: async (req: Request, res: Response) => {
    try {
      destroyToken(req);
      return res.status(200).json({ msg: "Successfully logged out!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default authControllers;
