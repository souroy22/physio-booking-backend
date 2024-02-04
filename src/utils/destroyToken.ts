import { Request } from "express";

const destroyToken = async (req: Request) => {
  req.token = "";
};

export default destroyToken;
