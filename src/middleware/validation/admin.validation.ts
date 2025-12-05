import { type Request, type Response, type NextFunction } from "express";

/**
 * Validation for admin login
 */
export function adminLoginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Request body is required" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const errors: string[] = [];

  if (!phone) {
    errors.push("phone is required");
  }

  if (!password) {
    errors.push("password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}

/**
 * Validation for adding fish item
 */
export function addFishValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = body.price;
  const minimum = body.minimum;
  const unit = typeof body.unit === "string" ? body.unit.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const uses = typeof body.uses === "string" ? body.uses.trim() : "";
  const offer = typeof body.offer === "string" ? body.offer.trim() : "";

  if (!name) errors.push("name is required");
  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push("price must be a positive number");
  }
  if (minimum === undefined || isNaN(Number(minimum)) || Number(minimum) < 0) {
    errors.push("minimum must be a non-negative number");
  }
  if (!unit) errors.push("unit is required (e.g., kg, piece, dozen)");
  if (!description) errors.push("description is required");
  if (!uses) errors.push("uses is required");
  if (!offer) errors.push("offer is required");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  // Sanitize
  req.body.name = name;
  req.body.price = Number(price);
  req.body.minimum = Number(minimum);
  req.body.unit = unit;
  req.body.description = description;
  req.body.uses = uses;
  req.body.offer = offer;

  next();
}

/**
 * Validation for updating fish item
 */
export function updateFishValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ message: "Valid fish item ID is required" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  // At least one field should be provided
  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field is required for update" });
  }

  // Validate provided fields
  if (body.price !== undefined) {
    if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
      errors.push("price must be a positive number");
    } else {
      req.body.price = Number(body.price);
    }
  }

  if (body.minimum !== undefined) {
    if (isNaN(Number(body.minimum)) || Number(body.minimum) < 0) {
      errors.push("minimum must be a non-negative number");
    } else {
      req.body.minimum = Number(body.minimum);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}

/**
 * Validation for deleting fish item
 */
export function deleteFishValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ message: "Valid fish item ID is required" });
  }
  next();
}

/**
 * Validation for updating order status
 */
export function updateOrderStatusValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { status } = req.body ?? {};

  const errors: string[] = [];

  if (!id || typeof id !== "string" || id.trim() === "") {
    errors.push("Valid order ID is required");
  }

  if (!status || typeof status !== "string") {
    errors.push("status is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}

/**
 * Validation for change password
 */
export function changePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  const errors: string[] = [];

  if (!currentPassword) {
    errors.push("currentPassword is required");
  }

  if (!newPassword) {
    errors.push("newPassword is required");
  } else {
    // Password strength check
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!pwdRegex.test(newPassword)) {
      errors.push(
        "newPassword must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}

export default {
  adminLoginValidation,
  addFishValidation,
  updateFishValidation,
  deleteFishValidation,
  updateOrderStatusValidation,
  changePasswordValidation,
};
