import { type Request, type Response, type NextFunction } from "express";
import {
  loginAdmin,
  addFishItem,
  updateFishItem,
  deleteFishItem,
  getAllFishItems,
  getAllOrders,
  updateOrder,
  changeAdminPassword,
} from "../services/admin.service";

/**
 * Admin login controller
 */
export async function adminLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { phone, password } = req.body ?? {};
    const result = await loginAdmin(String(phone), String(password));
    return res.json(result);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e && e.code === "INVALID_CREDENTIALS")
      return res.status(401).json({ message: "Invalid admin credentials" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Add fish item controller
 */
export async function addFish(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, price, minimum, unit, description, uses, offer } =
      req.body ?? {};

    const created = await addFishItem({
      name: String(name),
      price: Number(price),
      minimum: Number(minimum),
      unit: String(unit),
      description: String(description),
      uses: String(uses),
      offer: String(offer),
    });

    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Update fish item controller
 */
export async function updateFish(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, price, minimum, unit, description, uses, offer } =
      req.body ?? {};

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = String(name);
    if (price !== undefined) updatePayload.price = Number(price);
    if (minimum !== undefined) updatePayload.minimum = Number(minimum);
    if (unit !== undefined) updatePayload.unit = String(unit);
    if (description !== undefined)
      updatePayload.description = String(description);
    if (uses !== undefined) updatePayload.uses = String(uses);
    if (offer !== undefined) updatePayload.offer = String(offer);

    const updated = await updateFishItem(id, updatePayload);
    return res.json(updated);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e && e.code === "NOT_FOUND")
      return res.status(404).json({ message: "Fish item not found" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Delete fish item controller
 */
export async function deleteFish(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const result = await deleteFishItem(id);
    return res.json(result);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e && e.code === "NOT_FOUND")
      return res.status(404).json({ message: "Fish item not found" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Get all fish items controller
 */
export async function getFishList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await getAllFishItems();
    return res.json(items);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Get all orders controller
 */
export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await getAllOrders();
    return res.json(orders);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Update order status controller
 */
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    const validStatuses = [
      "pending",
      "accepted",
      "declined",
      "onaway",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses,
      });
    }

    const updated = await updateOrder(id, status);
    return res.json(updated);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e && e.code === "NOT_FOUND")
      return res.status(404).json({ message: "Order not found" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

/**
 * Change password controller
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { currentPassword, newPassword } = req.body ?? {};

    // Get admin ID from JWT token (set by isAdmin middleware)
    const adminId = (req as any).userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await changeAdminPassword(
      adminId,
      String(currentPassword),
      String(newPassword)
    );

    return res.json(result);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e && e.code === "INVALID_PASSWORD")
      return res.status(401).json({ message: "Current password is incorrect" });
    if (e && e.code === "NOT_FOUND")
      return res.status(404).json({ message: "Admin not found" });
    return res
      .status(500)
      .json({ message: "Server error", error: String(err) });
  }
}

export default {
  adminLogin,
  addFish,
  updateFish,
  deleteFish,
  getFishList,
  getOrders,
  updateOrderStatus,
  changePassword,
};
