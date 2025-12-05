import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/**
 * Middleware to verify admin access token and role
 */
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload | string;
    if (typeof decoded === "object" && decoded && "role" in decoded) {
      if (decoded.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Admin role required." });
      }
      // Attach admin info to request
      (req as Request & { userId?: string; role?: string }).userId = String(
        decoded.id
      );
      (req as Request & { userId?: string; role?: string }).role = String(
        decoded.role
      );
      return next();
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default isAdmin;
