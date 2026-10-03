import axios from "axios";
import Stripe from "stripe";
import config from "../config/config.js";

const payViaKhalti = async (data) => {
  const apiUrl = config.khalti.apiUrl;
  const secretKey = config.khalti.secretKey;
  const returnUrl = config.khalti.return_url || `${config.appUrl}/payment/khalti`;

  if (!apiUrl || !secretKey) {
    throw new Error(
      "Khalti is not configured. Add KHALTI_API_URL and KHALTI_SECRET_KEY to your .env file.",
    );
  }

  const body = {
    return_url: `${returnUrl.replace(/\/$/, "")}/${data.id}`,
    website_url: config.appUrl,
    amount: data.amount,
    purchase_order_id: data.purchaseOrderId,
    purchase_order_name: data.purchaseOrderName,
    customer_info: data.customerInfo,
  };

  const response = await axios.post(apiUrl, body, {
    headers: {
      Authorization: `Key ${secretKey}`,
    },
  });

  return response.data;
};

const payViaStripe = async (data) => {
  const stripe = new Stripe(config.stripeSecretKey);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: data.currency || "npr",
    metadata: {
      customer_email: data.customer.email,
      customer_phone: data.customer.phone,
      customer_name: data.customer.name,
      order_id: data.orderId,
      order_name: data.orderName,
    },
  });

  return paymentIntent;
};

export { payViaKhalti, payViaStripe };