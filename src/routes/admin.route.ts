import express from "express";
import { isAdmin } from "../middleware/admin.middleware";
import {
  adminLoginValidation,
  addFishValidation,
  updateFishValidation,
  deleteFishValidation,
  updateOrderStatusValidation,
  changePasswordValidation,
} from "../middleware/validation/admin.validation";
import {
  adminLogin,
  addFish,
  updateFish,
  deleteFish,
  getFishList,
  getOrders,
  updateOrderStatus,
  changePassword,
} from "../controllers/admin.controller";

const router = express.Router();

// PUBLIC ADMIN ROUTES (No auth required)
/**
 * @route   POST /admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/admin/login", adminLoginValidation, adminLogin);

// PROTECTED ADMIN ROUTES (Admin auth required)

/**
 * @route   GET /admin/fish
 * @desc    Get all fish items
 * @access  Admin only
 */
router.get("/admin/fish", isAdmin, getFishList);

/**
 * @route   POST /admin/fish
 * @desc    Add new fish item
 * @access  Admin only
 */
router.post("/admin/fish", isAdmin, addFishValidation, addFish);

/**
 * @route   PUT /admin/fish/:id
 * @desc    Update fish item
 * @access  Admin only
 */
router.put("/admin/fish/:id", isAdmin, updateFishValidation, updateFish);

/**
 * @route   DELETE /admin/fish/:id
 * @desc    Delete fish item
 * @access  Admin only
 */
router.delete("/admin/fish/:id", isAdmin, deleteFishValidation, deleteFish);

/**
 * @route   GET /admin/orders
 * @desc    Get all orders
 * @access  Admin only
 */
router.get("/admin/orders", isAdmin, getOrders);

/**
 * @route   PATCH /admin/orders/:id/status
 * @desc    Update order status
 * @access  Admin only
 */
router.patch(
  "/admin/orders/:id/status",
  isAdmin,
  updateOrderStatusValidation,
  updateOrderStatus
);

/**
 * @route   POST /admin/change-password
 * @desc    Change admin password
 * @access  Admin only
 */
router.post(
  "/admin/change-password",
  isAdmin,
  changePasswordValidation,
  changePassword
);

export default router;
