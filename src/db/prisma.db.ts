import prisma from "./prisma.client";
import type {
  User,
  RefreshToken,
  FishItem,
  Order,
  Prisma,
} from "@prisma/client";

// ============================================
// USER OPERATIONS
// ============================================

export async function AddUser(userData: any): Promise<User> {
  // Create user via Prisma; let Prisma set defaults (joined, id if not provided)
  const created = await prisma.user.create({ data: userData });
  return created;
}

export async function FindUserByPhone(phone: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { phone } });
  return user;
}

export async function GetAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function FindUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

export async function UpdateUserPassword(
  userId: string,
  hashedPassword: string
): Promise<User> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return updated;
}

// ============================================
// REFRESH TOKEN OPERATIONS
// ============================================

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

export async function GetRefreshToken(
  token: string
): Promise<RefreshToken | null> {
  const t = await prisma.refreshToken.findUnique({ where: { token } });
  if (!t) return null;
  if (t.revoked) return null;
  if (t.expires && t.expires < new Date()) return null;
  return t;
}

export async function RevokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  });
}

// ============================================
// FISH ITEM OPERATIONS
// ============================================

export async function AddFishItem(
  fishData: Prisma.FishItemCreateInput
): Promise<FishItem> {
  const created = await prisma.fishItem.create({ data: fishData });
  return created;
}

export async function UpdateFishItem(
  id: string,
  fishData: Prisma.FishItemUpdateInput
): Promise<FishItem> {
  const updated = await prisma.fishItem.update({
    where: { id },
    data: fishData,
  });
  return updated;
}

export async function DeleteFishItem(id: string): Promise<void> {
  await prisma.fishItem.delete({ where: { id } });
}

export async function FindFishItemById(id: string): Promise<FishItem | null> {
  return await prisma.fishItem.findUnique({ where: { id } });
}

export async function GetAllFishItems(): Promise<FishItem[]> {
  return await prisma.fishItem.findMany();
}

// ============================================
// ORDER OPERATIONS
// ============================================

export async function GetAllOrders(): Promise<Order[]> {
  return await prisma.order.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
      FishItem: {
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
        },
      },
    },
  });
}

export async function FindOrderById(id: string): Promise<Order | null> {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      User: true,
      FishItem: true,
    },
  });
}

export async function UpdateOrderStatus(
  id: string,
  status: "pending" | "accepted" | "declined" | "onaway" | "delivered"
): Promise<Order> {
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(status === "delivered" && { deliverdAt: new Date() }),
    },
  });
  return updated;
}

export default prisma;
