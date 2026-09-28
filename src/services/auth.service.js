import User from "../models/User.js";
import bcrypt from "bcrypt";

const login = async (data) => {
  const user = await User.findOne({
    $or: [{ email: data?.email }, { phone: data?.phone }],
  });

  if (!user) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  if (!user.isActive) {
    throw {
      status: 400,
      message: "User is inactive.",
    };
  }

  const isPasswordMatch = bcrypt.compareSync(data.password, user.password);

  if (!isPasswordMatch) {
    throw {
      status: 400,
      message: "Passwords do not match.",
    };
  }

  return {
    _id: user._id,
    address: user.address,
    email: user.email,
    isActive: user.isActive,
    name: user.name,
    phone: user.phone,
    roles: user.roles,
    profileImageUrl: user?.profileImageUrl,
  };
};

const register = async (data) => {
  const user = await User.findOne({
    $or: [{ email: data?.email }, { phone: data?.phone }],
  });

  if (user) {
    throw {
      status: 409,
      message: "User already exists.",
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(data.password, salt);

  delete data.roles;

  const createdUser = await User.create({
    ...data,
    password: hashedPassword,
  });

  return {
    _id: createdUser._id,
    address: createdUser.address,
    email: createdUser.email,
    isActive: createdUser.isActive,
    name: createdUser.name,
    phone: createdUser.phone,
    roles: createdUser.roles,
    profileImageUrl: user?.profileImageUrl,
  };
};

export default { register, login };