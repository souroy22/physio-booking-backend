import User from "../models/userModel";

const getUserData = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist ? isExist : null;
};

export default getUserData;
