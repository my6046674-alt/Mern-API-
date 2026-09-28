import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.js";
import { loginSchema, registerSchema } from "../libs/schemas/auth.schema.js";

const router = express.Router();

// Path: /api/auth/login
// Path: /api/auth/register

router.post("/login", validate(loginSchema), authController.login);

router.post("/register", validate(registerSchema), authController.register);

export default router;