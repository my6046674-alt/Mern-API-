import express from "express";
import auth from "../middlewares/auth.js";
import orderController from "../controllers/order.controller.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MERCHANT,
} from "../constants/roles.js";

const router = express.Router();

router.get("/", auth, roleBasedAuth(ROLE_ADMIN), orderController.getOrders);

router.get(
  "/user",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.getOrdersByUser,
);

router.get(
  "/merchant",
  auth,
  roleBasedAuth(ROLE_MERCHANT),
  orderController.getOrdersByMerchant,
);

router.get("/:id", auth, orderController.getOrderById);

router.post("/", auth, roleBasedAuth(ROLE_CUSTOMER), orderController.createOrder);

router.put(
  "/:id/status",
  auth,
  roleBasedAuth(ROLE_ADMIN),
  orderController.updateOrderStatus,
);

router.patch(
  "/:id/cancel",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.cancelOrder,
);

router.put(
  "/:id/confirm",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.confirmOrder,
);

router.put(
  "/:id/payment/cash",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaCash,
);

router.put(
  "/:id/payment/khalti",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaKhalti,
);

router.put(
  "/:id/payment/stripe",
  auth,
  roleBasedAuth(ROLE_CUSTOMER),
  orderController.orderPaymentViaStripe,
);

router.delete("/:id", auth, roleBasedAuth(ROLE_ADMIN), orderController.deleteOrder);

export default router;