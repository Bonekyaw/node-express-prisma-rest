import {  Request, Response, NextFunction } from 'express';

export const validatePhone = (req: Request, res: Response, next: NextFunction) => {
    let phone = req.body.phone.replace(/\s/g, "");

    if (phone.match("^[0-9]+$") == null) {
      // res.status(400).json({
      //     error: "Invalid phone number. Please enter the correct one."
      // });
      // throw new Error("Invalid phone number. Please enter the correct one.");
      const err: any = new Error("Invalid phone number. Please enter the correct one.");
      err.status = 400;
      return next(err);
    }
    if (phone.slice(0, 2) == "09") {
      phone = phone.substring(2, phone.length);
    }
    if (phone.length < 5 || phone.length > 12) {
      const err: any = new Error("Invalid phone number. Please enter the correct one.");
      err.status = 400;
      return next(err);
    }
    req.body.phone = phone;
    next();
  };
  
  
  