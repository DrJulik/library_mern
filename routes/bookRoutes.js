import express from "express";

import { isAuthenticated } from "../middlewares/auth";
import {
  addBook,
  deleteBook,
  getAllBooks,
} from "../controllers/bookController";

const router = express.Router();

router.post("/add", isAuthenticated, isAuthorized("admin"), addBook);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("admin"),
  deleteBook
);
router.get("/all", getAllBooks);

export default router;
