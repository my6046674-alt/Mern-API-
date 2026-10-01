import User from "../models/User.js";
import bcrypt from "bcrypt";

import {
  ROLE_CUSTOMER,
  ROLE_MERCHANT,
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
} from "../constants/roles.js";

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
    profileImageUrl: user.profileImageUrl,
  };
};

const register = async (data, { preserveRoles = false } = {}) => {
  const roles = data.roles ?? [ROLE_CUSTOMER];

  const allowedRoles = [
    ROLE_CUSTOMER,
    ROLE_MERCHANT,
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN,
  ];

  if (!Array.isArray(roles) || roles.length === 0) {
    throw {
      status: 400,
      message: "At least one role is required.",
    };
  }

  if (roles.some((role) => !allowedRoles.includes(role))) {
    throw {
      status: 400,
      message: "Invalid role provided.",
    };
  }

  if (
    !preserveRoles &&
    roles.some((role) => role === ROLE_ADMIN || role === ROLE_SUPER_ADMIN)
  ) {
    throw {
      status: 403,
      message: "Only an authorized super admin can assign admin roles.",
    };
  }

  const existingUser = await User.findOne({
    $or: [{ email: data?.email }, { phone: data?.phone }],
  });

  if (existingUser) {
    throw {
      status: 409,
      message: "User already exists.",
    };
  }

  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(data.password, salt);

  const createdUser = await User.create({
    ...data,
    roles,
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
    profileImageUrl: createdUser.profileImageUrl,
  };
};

export default {
  register,
  login,
};
