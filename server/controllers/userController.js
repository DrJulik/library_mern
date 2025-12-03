import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/userModel.js";

export const getAllUsers = async (req, res, next) => {
  const users = await User.find({ accountVerified: true });

  res.status(200).json({ success: true, users });
};

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });

  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
  });

  res
    .status(201)
    .json({ success: true, message: "Admin registered successfully", user });
});
