import { NextFunction, Request, Response } from "express";
import { decodeJWT } from "./GraphQLUtils";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.includes("Bearer")
  ) {
    res.status(401).send({
      message: "Token is missing",
      status: 401,
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    const data = decodeJWT(token);
    if (data && data.user_id) {
      res.setHeader("white_label_id", data.white_label_id);
      res.setHeader("user_id", data.user_id);
    } else {
      res.status(401).send({
        message: "Invalid Token",
        status: 401,
      });
    }
    next();
  }
};
