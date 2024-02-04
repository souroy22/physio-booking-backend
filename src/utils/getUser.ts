import User from "../models/userModel.ts";

const getUserData = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist ? isExist : null;
};

export default getUserData;
