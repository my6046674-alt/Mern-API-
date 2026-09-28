import mongoose from "mongoose";
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
} from "../constants/orderStatus.js";
import {
  PAYMENT_METHOD_CARD,
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_ONLINE,
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_SUCCESS,
} from "../constants/payment.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { payViaKhalti, payViaStripe } from "../utils/payment.js";
import userService from "./user.service.js";

// for admin
const getOrders = async () => {
  return await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "orderItems",
      },
    },
    {
      $match: {},
    },
    {
      $project: {
        orderNumber: 1,
        payment: 1,
        shippingAddress: 1,
        status: 1,
        totalPrice: 1,
        "user._id": 1,
        "user.name": 1,
        "user.email": 1,
        "user.phone": 1,
        "orderItems._id": 1,
        "orderItems.name": 1,
        "orderItems.price": 1,
        "orderItems.brand": 1,
        "orderItems.category": 1,
        "orderItems.imageUrls": 1,
        createdDate: 1,
      },
    },
  ]);
};

const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand category price imageUrls")
    .populate("payment", "transactionId amount method status");

  if (!order)
    throw {
      status: 404,
      message: "Order not found.",
    };

  return order;
};

const createOrder = async (data, authUser) => {
  const user = await userService.getById(authUser._id, authUser);

  if (!data.shippingAddress) {
    data.shippingAddress = user.address;
  }

  data.orderNumber = crypto.randomUUID();
  data.user = authUser._id;

  return await Order.create(data);
};

const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after" },
  );
};

const cancelOrder = async (id) => {
  return await Order.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS_CANCELLED },
    { returnDocument: "after" },
  );
};

const deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id);
};

const confirmOrder = async (id, status) => {
  const order = await getOrderById(id);

  if (status?.toUpperCase() != PAYMENT_STATUS_SUCCESS) {
    await Payment.findByIdAndUpdate(order.payment, {
      status: PAYMENT_STATUS_FAILED,
    });

    throw {
      status: 400,
      message: "Payment failed.",
    };
  }

  await Payment.findByIdAndUpdate(order.payment, {
    status: PAYMENT_STATUS_SUCCESS,
  });

  return await Order.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS_CONFIRMED },
    { returnDocument: "after" },
  );
};

const getOrdersByUser = async (userId, status) => {
  const filter = { user: userId };

  if (status) filter.status = status;

  return await Order.find(filter)
    .sort({ createdDate: -1 })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand category price imageUrls");
};

const getOrdersByMerchant = async (merchantId) => {
  return await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "orderItems",
      },
    },
    {
      $match: {
        "orderItems.createdBy": new mongoose.Types.ObjectId(merchantId),
      },
    },
    {
      $project: {
        orderNumber: 1,
        payment: 1,
        shippingAddress: 1,
        status: 1,
        totalPrice: 1,
        "user._id": 1,
        "user.name": 1,
        "user.email": 1,
        "user.phone": 1,
        "orderItems._id": 1,
        "orderItems.name": 1,
        "orderItems.price": 1,
        "orderItems.brand": 1,
        "orderItems.category": 1,
        "orderItems.imageUrls": 1,
        createdDate: 1,
      },
    },
  ]);
};

const orderPaymentViaCash = async (id) => {
  const order = await getOrderById(id);

  const orderPayment = await Payment.create({
    method: PAYMENT_METHOD_CASH,
    amount: order.totalPrice,
  });

  return await Order.findByIdAndUpdate(
    id,
    {
      status: ORDER_STATUS_CONFIRMED,
      payment: orderPayment.id,
    },
    { returnDocument: "after" },
  );
};

const orderPaymentViaKhalti = async (id) => {
  const order = await getOrderById(id);

  const orderPayment = await Payment.create({
    method: PAYMENT_METHOD_ONLINE,
    amount: order.totalPrice,
  });

  await Order.findByIdAndUpdate(id, {
    payment: orderPayment.id,
  });

  return await payViaKhalti({
    id: id,
    amount: order.totalPrice,
    purchaseOrderId: order.orderNumber,
    purchaseOrderName: order.orderItems[0].product.name,
    customerInfo: {
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
    },
  });
};

const orderPaymentViaStripe = async (id) => {
  const order = await getOrderById(id);

  const orderPayment = await Payment.create({
    method: PAYMENT_METHOD_CARD,
    amount: order.totalPrice,
  });

  await Order.findByIdAndUpdate(id, {
    payment: orderPayment.id,
  });

  return await payViaStripe({
    amount: order.totalPrice,
    orderId: order.orderNumber,
    orderName: order.orderItems[0].product.name,
    customer: {
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
    },
  });
};

export default {
  getOrders,
  getOrderById,
  getOrdersByMerchant,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  confirmOrder,
  orderPaymentViaCash,
  orderPaymentViaKhalti,
  orderPaymentViaStripe,
};