import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function isLogged(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = auth.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as any;
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default isLogged;
