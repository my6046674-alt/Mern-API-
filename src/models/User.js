import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required."],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    lowercase: true,
    unique: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailRegex.test(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [6, "Password length must be greater than 6."],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required."],
    minLength: 6,
    maxLength: 13,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: {
    city: {
      required: true,
      type: String,
    },
    province: String,
    street: String,
    country: {
      type: String,
      default: "Nepal",
    },
  },
  roles: {
    type: [String],
    enum: ["CUSTOMER", "MERCHANT", "ADMIN", "SUPER_ADMIN"],
    default: ["CUSTOMER"],
  },
  profileImageUrl: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);