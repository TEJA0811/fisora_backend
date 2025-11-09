import { type Request, type Response, type NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  const status = err && err.status ? err.status : 500;
  return res
    .status(status)
    .json({
      message: err && err.message ? err.message : "Internal Server Error",
      error: String(err),
    });
}

export default errorHandler;
