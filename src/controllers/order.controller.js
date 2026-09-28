import orderService from "../services/order.service.js";

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();

    res.json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getOrdersByMerchant = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByMerchant(req.user._id);

    res.json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(
      req.user._id,
      req.query?.status,
    );

    res.json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const createdOrder = await orderService.createOrder(req.body, req.user);

    res.json(createdOrder);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  if (!req.body?.status) {
    return res.status(400).send("Status is required.");
  }

  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);

    res.json({ message: "Order deleted." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id);

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const confirmOrder = async (req, res) => {
  try {
    const order = await orderService.confirmOrder(
      req.params.id,
      req.body?.status,
    );

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const orderPaymentViaCash = async (req, res) => {
  try {
    const order = await orderService.orderPaymentViaCash(req.params.id);

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const orderPaymentViaKhalti = async (req, res) => {
  try {
    const order = await orderService.orderPaymentViaKhalti(req.params.id);

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const orderPaymentViaStripe = async (req, res) => {
  try {
    const order = await orderService.orderPaymentViaStripe(req.params.id);

    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
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
  orderPaymentViaStripe
};