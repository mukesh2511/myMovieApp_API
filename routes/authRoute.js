import express from "express";
import {
  login,
  logout,
  register,
  sendOtp,
  verifyOtp,
  verifytoken,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/login", login);
router.get("/verifytoken", verifyToken, verifytoken);
router.post("/logout", logout);

export default router;
