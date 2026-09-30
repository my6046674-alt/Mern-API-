import express from "express";
import multer from "multer";

import config from "./config/config.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.route.js";
import connectDB from "./config/database.js";
import logger from "./middlewares/logger.js";
import connectCloudinary from "./config/cloudinary.js";
import productServices from "./services/product.service.js";
import dns from "dns"



const app = express();
dns.setServers(["1.1.1.1", "8.8.8.8"])


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 }, // 5MB file size
});



// Use this instead of bodyparser.json()
app.use(express.json());

app.use(logger);

// app.set("view engine", "hbs");

connectDB();

connectCloudinary();

// app.get("/", (req, res) => {
//   res.json({
//     status: "OK",
//     name: "mern-20260719-api",
//     version: "0.1.0",
//     port: config.port,
//   });
// });

app.get("/home", (req, res) => {
  res.render("index.hbs", { name: "Ram" });
});

app.get("/products", async (req, res) => {
  const products = await productServices.getProducts();

  res.render("products.hbs", { products, apiUrl: config.apiUrl });
});

app.get("/products/:id", async (req, res) => {
  const product = await productServices.getProductById(req.params.id);

  res.render("product.hbs", { product });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", upload.single("image"), userRoutes);
app.use("/api/products", upload.array("images", 5), productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(config.port, () => {
  console.log(`Server running at port ${config.port}...`);
});