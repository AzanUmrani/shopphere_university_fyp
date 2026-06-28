import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string[]> = {};

    errors.array().forEach((error: any) => {
      if (!formattedErrors[error.path || error.param]) {
        formattedErrors[error.path || error.param] = [];
      }
      formattedErrors[error.path || error.param].push(error.msg);
    });

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  next();
};
