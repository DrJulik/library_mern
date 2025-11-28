import express from "express";
import {
  getAllUsers,
  registerNewAdmin,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);

router.post(
  "/add/admin",
  isAuthenticated,
  isAuthorized("Admin"),
  registerNewAdmin
);

export default router;
