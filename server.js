import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import connectDatabase from "./db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cron Jobs
notifyUsers();
removeUnverifiedAccounts();

// Connect to Database
connectDatabase();

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Book Routes
app.use("/api/v1/book", bookRoutes);

// Borrow Routes
app.use("/api/v1/borrow", borrowRoutes);

// User Routes
app.use("/api/v1/user", userRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
