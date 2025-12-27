import { Request, Response } from "express";
import { ExpressJoiError } from "express-joi-validation";
import { ValidationError as OldValidationError } from "express-validation"; // Only needed if still used

interface AppError extends Error {
  code?: number;
  status?: number;
}

const errorResponse = (
  err: AppError,
  req: Request,
  res: Response,
) => {
  const isDev = req.app.get("env") === "development";
  res.locals.error = isDev ? err : {};

  try {
    let statusCode = err.code || err.status || 500;

    console.error("this is breaking");

    // express-joi-validation errors (Body, Params, Query)
    if ((err as unknown as ExpressJoiError)?.error?.isJoi) {
      return res.status(400).json({
        success: false,
        status: 400,
        errorMessage: (err as unknown as ExpressJoiError).error.details.map(
          (d) => d.message,
        ),
        data: [],
      });
    }

    if (err instanceof OldValidationError) {
      statusCode = 422;
    }

    return res.status(statusCode).json({
      success: false,
      errorMessage: err.message || "Internal error",
      status: statusCode,
      data: [],
    });

  } catch (internalErr: any) {
    console.error(internalErr, "here");

    return res.status(500).json({
      success: false,
      errorMessage: internalErr?.message || "Internal Server Error",
      status: 500,
      data: [],
    });
  }
};

export default errorResponse;
