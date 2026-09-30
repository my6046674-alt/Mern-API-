
import express from "express";
import multer from "multer";
import dns from "dns";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.route.js";

import logger from "./middlewares/logger.js";
import productServices from "./services/product.service.js";
import config from "./config/config.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 },
});

app.use(express.json());

app.use(logger);

// Home route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "MERN API is running successfully",
  });
});

// Existing routes
app.get("/home", (req, res) => {
  res.render("index.hbs", { name: "Ram" });
});

app.get("/products", async (req, res) => {
  const products = await productServices.getProducts();

  res.render("products.hbs", {
    products,
    apiUrl: config.apiUrl,
  });
});

app.get("/products/:id", async (req, res) => {
  const product = await productServices.getProductById(req.params.id);

  res.render("product.hbs", { product });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", upload.single("image"), userRoutes);
app.use("/api/products", upload.array("images", 5), productRoutes);
app.use("/api/orders", orderRoutes);

export default app;
