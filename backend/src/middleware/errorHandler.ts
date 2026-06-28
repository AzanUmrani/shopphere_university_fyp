import { Request, Response, NextFunction } from "express";
import logger from "@/config/logger";

interface ApiError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Log error
  logger.error(`Error ${statusCode}: ${message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: error.stack,
  });

  // Sequelize validation errors
  if (error.name === "SequelizeValidationError") {
    statusCode = 400;
    const errors: Record<string, string[]> = {};

    (error as any).errors.forEach((err: any) => {
      if (!errors[err.path]) {
        errors[err.path] = [];
      }
      errors[err.path].push(err.message);
    });

    res.status(statusCode).json({
      success: false,
      message: "Validation error",
      errors,
    });
    return;
  }

  // Sequelize unique constraint error
  if (error.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Resource already exists";

    const errors: Record<string, string[]> = {};
    (error as any).errors.forEach((err: any) => {
      if (!errors[err.path]) {
        errors[err.path] = [];
      }
      errors[err.path].push(`${err.path} already exists`);
    });

    res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
    return;
  }

  // Sequelize foreign key constraint error
  if (error.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid reference to related resource";
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Multer errors (file upload)
  if (error.name === "MulterError") {
    statusCode = 400;
    if ((error as any).code === "LIMIT_FILE_SIZE") {
      message = "File too large";
    } else if ((error as any).code === "LIMIT_FILE_COUNT") {
      message = "Too many files";
    } else if ((error as any).code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field";
    }
  }

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const message = `Route ${req.originalUrl} not found`;

  logger.warn(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
