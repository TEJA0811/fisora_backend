import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import {
  AddFishItem,
  UpdateFishItem,
  DeleteFishItem,
  FindFishItemById,
  GetAllFishItems,
  GetAllOrders,
  UpdateOrderStatus,
  FindOrderById,
  FindUserByPhone,
  FindUserById,
  UpdateUserPassword,
} from "../db/prisma.db";
import type { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/**
 * Admin login - validates against database with role check
 */
export async function loginAdmin(phone: string, password: string) {
  // Find user by phone
  const user = await FindUserByPhone(String(phone));

  if (!user) {
    const err = new Error("Invalid admin credentials") as Error & {
      code?: string;
    };
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // Check if user has admin role
  if (user.role !== "admin") {
    const err = new Error("Access denied. Admin role required.") as Error & {
      code?: string;
    };
    err.code = "FORBIDDEN";
    throw err;
  }

  // Verify password
  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    const err = new Error("Invalid admin credentials") as Error & {
      code?: string;
    };
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // Generate admin access token with admin role
  const accessToken = jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    accessToken,
    admin: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Add a new fish item
 */
export async function addFishItem(payload: {
  name: string;
  price: number;
  minimum: number;
  unit: string;
  description: string;
  uses: string;
  offer: string;
}) {
  const fishData: Prisma.FishItemCreateInput = {
    id: randomUUID(),
    name: String(payload.name),
    price: Number(payload.price),
    minimum: Number(payload.minimum),
    unit: String(payload.unit),
    description: String(payload.description),
    uses: String(payload.uses),
    offer: String(payload.offer),
  };

  const created = await AddFishItem(fishData);
  return created;
}

/**
 * Update an existing fish item
 */
export async function updateFishItem(
  id: string,
  payload: Partial<{
    name: string;
    price: number;
    minimum: number;
    unit: string;
    description: string;
    uses: string;
    offer: string;
  }>
) {
  // Check if fish exists
  const existing = await FindFishItemById(id);
  if (!existing) {
    const err = new Error("Fish item not found") as Error & { code?: string };
    err.code = "NOT_FOUND";
    throw err;
  }

  const updateData: Prisma.FishItemUpdateInput = {};
  if (payload.name !== undefined) updateData.name = String(payload.name);
  if (payload.price !== undefined) updateData.price = Number(payload.price);
  if (payload.minimum !== undefined)
    updateData.minimum = Number(payload.minimum);
  if (payload.unit !== undefined) updateData.unit = String(payload.unit);
  if (payload.description !== undefined)
    updateData.description = String(payload.description);
  if (payload.uses !== undefined) updateData.uses = String(payload.uses);
  if (payload.offer !== undefined) updateData.offer = String(payload.offer);

  const updated = await UpdateFishItem(id, updateData);
  return updated;
}

/**
 * Delete a fish item
 */
export async function deleteFishItem(id: string) {
  const existing = await FindFishItemById(id);
  if (!existing) {
    const err = new Error("Fish item not found") as Error & { code?: string };
    err.code = "NOT_FOUND";
    throw err;
  }

  await DeleteFishItem(id);
  return { message: "Fish item deleted successfully" };
}

/**
 * Get all fish items (for admin view)
 */
export async function getAllFishItems() {
  return await GetAllFishItems();
}

/**
 * Get all orders (admin view)
 */
export async function getAllOrders() {
  return await GetAllOrders();
}

/**
 * Update order status
 */
export async function updateOrder(
  orderId: string,
  status: "pending" | "accepted" | "declined" | "onaway" | "delivered"
) {
  const existing = await FindOrderById(orderId);
  if (!existing) {
    const err = new Error("Order not found") as Error & { code?: string };
    err.code = "NOT_FOUND";
    throw err;
  }

  const updated = await UpdateOrderStatus(orderId, status);
  return updated;
}

/**
 * Change admin password (only admin can change their own password)
 */
export async function changeAdminPassword(
  adminId: string,
  currentPassword: string,
  newPassword: string
) {
  // Find admin user
  const admin = await FindUserById(adminId);
  if (!admin) {
    const err = new Error("Admin not found") as Error & { code?: string };
    err.code = "NOT_FOUND";
    throw err;
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    const err = new Error("Current password is incorrect") as Error & {
      code?: string;
    };
    err.code = "INVALID_PASSWORD";
    throw err;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await UpdateUserPassword(adminId, hashedPassword);

  return { message: "Password updated successfully" };
}

export default {
  loginAdmin,
  addFishItem,
  updateFishItem,
  deleteFishItem,
  getAllFishItems,
  getAllOrders,
  updateOrder,
  changeAdminPassword,
};
