import express from "express";

const router = express.Router();

import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  OTPValidation,
  getOTPValidation,
  refreshTokenValidation,
} from "../middleware/validation/auth.validation.js";

import {
  changePassword,
  getOtp,
  login,
  register,
  verifyOTP,
  refreshToken,
  logout,
} from "../controllers/auth.controller";

router.post("/login", loginValidation, login);

router.post("/signup", registerValidation, register);

router.post("/change_password", updatePasswordValidation, changePassword);

router.post("/verify_otp", OTPValidation, verifyOTP);

router.post("/get_otp", getOTPValidation, getOtp);

router.post("/refresh-token", refreshTokenValidation, refreshToken);
router.post("/logout", refreshTokenValidation, logout);

export default router;
