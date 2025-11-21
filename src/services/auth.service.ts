import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
// We're using Prisma models for DB types. Avoid importing local DTO interfaces here.
import {
  AddUser,
  FindUserByPhone,
  CreateRefreshToken,
  GetRefreshToken,
  RevokeRefreshToken,
} from "../db/prisma.db";
import type { Prisma, User as PrismaUser, RefreshToken as PrismaRefreshToken } from "@prisma/client";

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
    const err = new Error("Phone already registered") as Error & { code?: string };
    err.code = "DUPLICATE";
    throw err;
  }

  const hashed = await bcrypt.hash(String(password), 10);

  const userData: Prisma.UserCreateInput = {
    // Build DB payload (let Prisma set defaults like joined)
    id: randomUUID(),
    name: String(name),
    email: String(email),
    password: hashed,
    phone: String(phone),
    status: "created" as const,
  } as Prisma.UserCreateInput;

  const created = await AddUser(userData);

  // Return public user fields (map Date -> ISO string)
  return {
    id: created.id,
    name: created.name,
    email: created.email,
    phone: created.phone,
    joined:
      created.joined instanceof Date
        ? created.joined.toISOString()
        : String(created.joined),
    status: created.status,
  };
}

export async function loginUser(phone: string, password: string) {
  const user = await FindUserByPhone(String(phone));
  if (!user) {
    const err = new Error("Invalid credentials") as Error & { code?: string };
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  const match = await bcrypt.compare(String(password), user.password);
  if (!match) {
    const err = new Error("Invalid credentials") as Error & { code?: string };
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
    const err = new Error("Invalid refresh token") as Error & { code?: string };
    err.code = "INVALID_REFRESH";
    throw err;
  }

  // Revoke old refresh token (rotation)
  await RevokeRefreshToken(token.token);

  // Issue a new refresh token
  const newRefreshToken = randomUUID();
  await CreateRefreshToken(token.userId, newRefreshToken, 7 * 24 * 60 * 60);

  const accessToken = jwt.sign({ id: token.userId }, JWT_SECRET, {
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
