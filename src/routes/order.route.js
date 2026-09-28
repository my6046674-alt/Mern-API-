import express from "express";
import orderController from "../controllers/order.controller.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MERCHANT,
} from "../constants/roles.js";

const router = express.Router();

router.get("/", roleBasedAuth(ROLE_ADMIN), orderController.getOrders);

router.get(
  "/user",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.getOrdersByUser,
);

router.get(
  "/merchant",
  roleBasedAuth(ROLE_MERCHANT),
  orderController.getOrdersByMerchant,
);

router.get("/:id", orderController.getOrderById);

router.post("/", roleBasedAuth(ROLE_CUSTOMER), orderController.createOrder);

router.put(
  "/:id/status",
  roleBasedAuth(ROLE_ADMIN),
  orderController.updateOrderStatus,
);

router.patch(
  "/:id/cancel",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.cancelOrder,
);

router.put(
  "/:id/confirm",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.confirmOrder,
);

router.put(
  "/:id/payment/cash",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaCash,
);

router.put(
  "/:id/payment/khalti",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaKhalti,
);

router.put(
  "/:id/payment/stripe",
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaStripe,
);

router.delete("/:id", roleBasedAuth(ROLE_ADMIN), orderController.deleteOrder);

export default router;