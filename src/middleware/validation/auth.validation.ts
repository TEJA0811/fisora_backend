import { type Request, type Response, type NextFunction } from "express";

// Validation middleware for auth routes
export function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Stricter input checks for login endpoint
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Request body is required" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const errors: string[] = [];

  if (!phone) {
    errors.push("phone is required");
  } else {
    const normalizedPhone = phone.replace(/\s+/g, "");
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      errors.push(
        "phone must be a valid phone number (digits only, optional leading +, 7-15 digits)"
      );
    } else {
      req.body.phone = normalizedPhone;
    }
  }

  if (!password) {
    errors.push("password is required");
  } else if (typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  // passed basic validation
  next();
}

export function registerValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const errors: string[] = [];

  // name: required, at least 2 chars
  if (!name) {
    errors.push("name is required");
  } else if (name.length < 2) {
    errors.push("name must be at least 2 characters");
  }

  // email: required and basic format
  if (!email) {
    errors.push("email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("email must be a valid email address");
    }
  }

  // phone: required and basic E.164-like validation (optional leading +, 7-15 digits)
  if (!phone) {
    errors.push("phone is required");
  } else {
    const normalizedPhone = phone.replace(/\s+/g, "");
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      errors.push(
        "phone must be a valid phone number (digits only, optional leading +, 7-15 digits)"
      );
    } else {
      // put normalized phone back so controller receives cleaned value
      req.body.phone = normalizedPhone;
    }
  }

  // password: required and reasonably strong
  if (!password) {
    errors.push("password is required");
  } else {
    // at least 8 chars, one lower, one upper, one digit, one special
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!pwdRegex.test(password)) {
      errors.push(
        "password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  // sanitize and put back cleaned values
  req.body.name = name;
  req.body.email = email;
  // phone is already normalized above

  next();
}

export function OTPValidation(req: Request, res: Response, next: NextFunction) {
  // Example: expecting { phone, otp }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  const errors: string[] = [];
  if (!phone) errors.push("phone is required");
  if (!otp) errors.push("otp is required");
  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });
  next();
}

export function updatePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // expecting { phone, oldPassword, newPassword } or token-based flow
  const body = (req.body ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const oldPassword =
    typeof body.oldPassword === "string" ? body.oldPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  const errors: string[] = [];
  if (!phone) errors.push("phone is required");
  if (!newPassword) errors.push("newPassword is required");
  else {
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!pwdRegex.test(newPassword))
      errors.push(
        "newPassword must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
  }
  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });
  next();
}

export function getOTPValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // expecting { phone }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!phone)
    return res
      .status(400)
      .json({ message: "Validation failed", errors: ["phone is required"] });
  next();
}

export function refreshTokenValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(400).json({ message: "Valid refresh token is required" });
  }
  next();
}
