import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the adminId property
interface CustomRequest extends Request {
  adminId?: number; // or string, depending on your ID type
}

const isAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err: any = new Error("You are not an authenticated user!.");
    err.status = 401;
    return next(err);
  }

  const token = authHeader!.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: number;
    };
  } catch (error: any) {
    error.status = 500;
    return next(error);
  }

  if (!decodedToken) {
    const err: any = new Error("You are not an authenticated user!.");
    err.status = 401;
    return next(err);
  }

  req.adminId = decodedToken.id;
  next();
};

export default isAuth;
