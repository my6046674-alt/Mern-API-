import express from "express";

import userController from "../controllers/user.controller.js";
import { ROLE_ADMIN } from "../constants/roles.js";
import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";

const router = express.Router();

router.get("/", auth, roleBasedAuth(ROLE_ADMIN), userController.getAllUsers);

router.put("/profile-image", auth, userController.updateProfileImage);

router.get("/:id", auth, userController.getById);

router.post("/", auth, roleBasedAuth(ROLE_ADMIN), userController.createUser);

router.put("/:id", auth, userController.updateUser);

router.delete("/:id", auth, roleBasedAuth(ROLE_ADMIN), userController.deleteUser);

router.patch("/:id/roles", auth, roleBasedAuth(ROLE_ADMIN), userController.updateUserRoles);

export default router;