import pkg from 'express';
const { Response, Request, NextFunction } = pkg;
// import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key'
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
