import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { User } from "../type/User.js";
import {
  AddUser,
  FindUserByPhone,
  CreateRefreshToken,
  GetRefreshToken,
  RevokeRefreshToken,
} from "../db/dummy.db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const { name, email, phone, password } = payload;

  // check duplicate
  const existing = await FindUserByPhone(phone);
  if (existing) {
    const err: any = new Error("Phone already registered");
    err.code = "DUPLICATE";
    throw err;
  }

  const hashed = await bcrypt.hash(String(password), 10);

  const user: User = {
    id: randomUUID(),
    name: String(name),
    email: String(email),
    joined: new Date().toISOString(),
    password: hashed,
    phone: String(phone),
    status: "created",
  };

  await AddUser(user);

  // Return public user fields
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    joined: user.joined,
    status: user.status,
  };
}

export async function loginUser(phone: string, password: string) {
  const user = await FindUserByPhone(String(phone));
  if (!user) {
    const err: any = new Error("Invalid credentials");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  const match = await bcrypt.compare(String(password), user.password);
  if (!match) {
    const err: any = new Error("Invalid credentials");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // access token (short-lived)
  const accessToken = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
    expiresIn: "15m",
  });

  // refresh token (stored server-side)
  const refreshToken = randomUUID();
  // store refresh token for 7 days (in seconds)
  await CreateRefreshToken(user.id, refreshToken, 7 * 24 * 60 * 60);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const token = await GetRefreshToken(refreshToken);
  if (!token) {
    const err: any = new Error("Invalid refresh token");
    err.code = "INVALID_REFRESH";
    throw err;
  }

  // Revoke old refresh token (rotation)
  await RevokeRefreshToken(token.token);

  // Issue a new refresh token
  const newRefreshToken = randomUUID();
  await CreateRefreshToken(token.user_id, newRefreshToken, 7 * 24 * 60 * 60);

  const accessToken = jwt.sign({ id: token.user_id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken: newRefreshToken };
}

export async function revokeRefreshToken(refreshToken: string) {
  await RevokeRefreshToken(refreshToken);
}

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
};
