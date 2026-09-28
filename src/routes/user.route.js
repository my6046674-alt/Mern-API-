import express from "express";

import userController from "../controllers/user.controller.js";
import { ROLE_ADMIN } from "../constants/roles.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";

const router = express.Router();

router.get("/", roleBasedAuth(ROLE_ADMIN), userController.getAllUsers);

router.put("/profile-image", userController.updateProfileImage);

router.get("/:id", userController.getById);

router.post("/", roleBasedAuth(ROLE_ADMIN), userController.createUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", roleBasedAuth(ROLE_ADMIN), userController.deleteUser);

router.patch("/:id/roles", roleBasedAuth(ROLE_ADMIN), userController.updateUserRoles);

export default router;