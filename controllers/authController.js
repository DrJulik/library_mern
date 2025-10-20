import User from "../models/userModel.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import sendVerificationCode from "../utils/sendVerificationCode.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";
import { catchAsyncErrors } from "../middlewares/errorMiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";

// Register user
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if verified user already exists
    const existingVerifiedUser = await User.findOne({
      email,
      accountVerified: true,
    });
    if (existingVerifiedUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Check if all fields are filled
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Check if password is at least 6 characters and less than 12 characters
    if (password.length < 6 || password.length > 12) {
      return next(
        new ErrorHandler(
          "Password must be at least 6 characters and less than 12 characters",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for existing unverified user
    const existingUnverifiedUser = await User.findOne({
      email,
      accountVerified: false,
    });

    let user;

    if (existingUnverifiedUser) {
      // Update existing unverified user with new data
      user = existingUnverifiedUser;
      user.name = name;
      user.password = hashedPassword;
    } else {
      // Create new user instance
      user = new User({
        name,
        email,
        password: hashedPassword,
      });
    }

    // Generate verification code
    const verificationCode = user.generateVerificationCode();

    // Try to send verification code first
    await sendVerificationCode(email, verificationCode);

    // Save user to database (either update existing or create new)
    await user.save();

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification code.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({
      createdAt: -1,
    });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found or already verified", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP expired", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account verified successfully", res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  sendToken(user, 200, "Login successful", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

  if(!req.body.email) {
    return next(new ErrorHandler("Please fill all fields", 400))
  }

  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true
  });

  if(!user) {
    return next(new ErrorHandler("Invalid email", 400))
  }

  const resetToken = user.getResetPasswordToken();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl)

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500))
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if(!user) {
    return next(new ErrorHandler("Invalid or expired token", 400))
  }

  if(req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match", 400))
  }

  if(req.body.password.length < 6 || req.body.password.length > 12 || req.body.confirmPassword.length < 6 || req.body.confirmPassword.length > 12) {
    return next(new ErrorHandler("Password must be at least 6 characters and less than 12 characters", 400))
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Password reset successful", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if(!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all fields", 400))
  }
  
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);

  if(!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400))
  }

  if(newPassword.length < 6 || newPassword.length > 12 || confirmNewPassword.length < 6 || confirmNewPassword.length > 12) {
    return next(new ErrorHandler("Password must be at least 6 characters and less than 12 characters", 400))
  }

  if(newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm new password do not match", 400))
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
