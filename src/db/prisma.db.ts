import prisma from "./prisma.client";
import type { User, RefreshToken } from "@prisma/client";

export async function AddUser(userData: any): Promise<User> {
  // Create user via Prisma; let Prisma set defaults (joined, id if not provided)
  const created = await prisma.user.create({ data: userData });
  return created;
}

export async function FindUserByPhone(phone: string): Promise<User | null> {
  const u = await prisma.user.findUnique({ where: { phone } });
  return u;
}

export async function GetAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function CreateRefreshToken(
  userId: string,
  token: string,
  expiresInSeconds: number
): Promise<RefreshToken> {
  const expires = new Date(Date.now() + expiresInSeconds * 1000);
  const created = await prisma.refreshToken.create({
    data: { id: token, userId, token, expires },
  });
  return created;
}

export async function GetRefreshToken(token: string): Promise<RefreshToken | null> {
  const t = await prisma.refreshToken.findUnique({ where: { token } });
  if (!t) return null;
  if (t.revoked) return null;
  if (t.expires && t.expires < new Date()) return null;
  return t;
}

export async function RevokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
}

export default prisma;
