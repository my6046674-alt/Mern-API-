import express from "express";

import productController from "../controllers/product.controller.js";
import logger from "../middlewares/logger.js";
import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import { ROLE_ADMIN, ROLE_MERCHANT } from "../constants/roles.js";
import validate from "../middlewares/validator.js";
import { productSchema } from "../libs/schemas/product.schema.js";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/brands", productController.getBrands);

router.get("/categories", productController.getCategories);

router.get("/count", productController.getTotalCount);

// Dynamic route (:param)
router.get("/:id", productController.getProductById);

router.post(
  "/",
  auth,
  roleBasedAuth(ROLE_MERCHANT),
  validate(productSchema),
  productController.createProduct,
);

router.put(
  "/:id",
  auth,
  roleBasedAuth(ROLE_MERCHANT),
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth,
  roleBasedAuth(ROLE_MERCHANT),
  productController.deleteProduct,
);

export default router;