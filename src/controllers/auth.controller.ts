import { type Request, type Response, type NextFunction } from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
} from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import type { User } from "../type/User.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body ?? {};
    if (!phone || !password)
      return res
        .status(400)
        .json({ message: "phone and password are required" });

    const result = await loginUser(String(phone), String(password));
    
    return res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    // Map known errors to appropriate status codes
    const e: any = err;
    if (e && e.code === "INVALID_CREDENTIALS")
      return res.status(401).json({ message: "Invalid credentials" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, phone, password } = req.body ?? {};
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "name, email, phone and password are required" });
    }

    const created = await registerUser({
      name: String(name),
      email: String(email),
      phone: String(phone),
      password: String(password),
    });
    return res.status(201).json(created);
  } catch (err) {
    const e: any = err;
    if (e && e.code === "DUPLICATE")
      return res.status(409).json({ message: "Phone already registered" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

export function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: implement change password logic here (requires DB update)
  return res.status(501).json({ message: "Not implemented" });
}

export function getOtp(req: Request, res: Response, next: NextFunction) {
  // TODO: implement generate otp logic here
  return res.status(501).json({ message: "Not implemented" });
}

export function verifyOTP(req: Request, res: Response, next: NextFunction) {
  // TODO: implement otp verification logic here
  return res.status(501).json({ message: "Not implemented" });
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.body;
    const r = await refreshAccessToken(String(refreshToken));
    return res.json(r);
  } catch (err) {
    const e: any = err;
    if (e && e.code === "INVALID_REFRESH")
      return res.status(401).json({ message: "Invalid refresh token" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken is required" });
    await revokeRefreshToken(String(refreshToken));
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}
