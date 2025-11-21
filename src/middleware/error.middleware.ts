import { type Request, type Response, type NextFunction } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err as Error);
  const e = err as { status?: number; message?: string };
  const status = e && e.status ? e.status : 500;
  return res
    .status(status)
    .json({
      message: e && e.message ? e.message : "Internal Server Error",
      error: String(err),
    });
}

export default errorHandler;
