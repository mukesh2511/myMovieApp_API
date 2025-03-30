import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import createError from "../utils/error.js";
import { sendOtpEmail } from "../utils/nodeMailer.js";

//register
export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) {
      return next(createError(400, "User already exists"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

//login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(404, "user not found"));
    }
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) {
      return next(createError(400, "wrong username or password"));
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWTSECRET
    );
    const { password, ...info } = user._doc;
    // res.cookie("accessToken", token, { httpOnly: true }).status(200).send(info);
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true, // Set to true in production
        sameSite: "None", // Required for cross-origin cookies
      })
      .status(200)
      .send(info);
  } catch (error) {
    next(error);
  }
};
//otp login
export const sendOtp = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(404, "user not found"));
    }

    const otp = await sendOtpEmail(email);
    if (otp === null) {
      return next(
        createError(
          {
            success: false,
            message: "Error sending email",
          },
          { status: 500 }
        )
      );
    }
    const Updatefields = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { verifyCode: otp },
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//verify otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log("Verifying OTP for:", email, "OTP:", otp);

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("User not found for email:", email);
      return next(createError(404, "user not found"));
    }
    console.log("User found:", user._id);

    if (!user.verifyCode) {
      console.log("No verification code found for user");
      return next(createError(400, "No verification code found"));
    }

    const otpToBeVerified = user.verifyCode.toString();
    console.log("Stored OTP:", otpToBeVerified, "Provided OTP:", otp);

    if (otpToBeVerified !== otp) {
      console.log("OTP mismatch");
      return next(createError(400, "Invalid OTP"));
    }

    user.verifyCode = 0;
    await user.save();
    console.log("User saved, generating token...");

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWTSECRET
    );
    console.log(
      "Token generated:",
      token ? "Yes" : "No",
      "Length:",
      token ? token.length : 0
    );
    console.log({ token });

    const { password, ...info } = user._doc;
    console.log("Sending response...");

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true, // True in production
        sameSite: "None", // Required for cross-origin cookies
      })
      .status(200)
      .send(info);

    console.log("Response sent");
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    next(error);
  }
};

//logout
export const logout = async (req, res, next) => {
  res
    .clearCookie("accessToken", { sameSite: "none", secure: true })
    .status(200)
    .send("User have been logged out successfully");
};
////verifyToken
export const verifytoken = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -verifyCode"
    );
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};
