import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the adminId property
interface CustomRequest extends Request {
  adminId?: number; // or string, depending on your ID type
}

const checkAuth = (param: any) => {
  if (!param) {
    const err: any = new Error("You are not an authenticated user!.");
    err.status = 401;
    throw err;
  }
};

const isAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  checkAuth(authHeader);

  const token = authHeader!.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: number };
  } catch (error: any) {
    error.status = 500;
    throw error;
  }

  checkAuth(decodedToken);
  req.adminId = decodedToken.id;
  next();
};

export default isAuth;