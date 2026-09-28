import mongoose from "mongoose";
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_SHIPPED,
} from "../constants/orderStatus.js";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required."],
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product is required."],
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1."],
      },
    },
  ],
  status: {
    type: String,
    default: ORDER_STATUS_PENDING,
    enum: [
      ORDER_STATUS_PENDING,
      ORDER_STATUS_CONFIRMED,
      ORDER_STATUS_SHIPPED,
      ORDER_STATUS_DELIVERED,
      ORDER_STATUS_CANCELLED,
    ],
  },
  shippingAddress: {
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
  orderNumber: {
    type: String,
    required: [true, "Order number is required."],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required."],
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },
  createdDate: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

export default mongoose.model("Order", orderSchema);