import "dotenv/config";

import asyncHandler from "express-async-handler";

import { body, validationResult } from "express-validator";
// import { v4: uuidv4 } from "uuid";
// import moment from 'moment';
const moment = require("moment");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  checkPhoneExist,
  checkPhoneIfNotExist,
  checkOtpErrorIfSameDate,
  checkOtpPhone,
} from "./../utils/auth";

import {
  getAdminByPhone,
  getOtpByPhone,
  createOtp,
  updateOtp,
  createAdmin,
  updateAdmin,
} from "../services/authService";

/*
 * POST localhost:8080/api/v1/register
 * Register an admin using Phone & password only
 * In real world, OTP should be used to verify phone number
 * But in this app, we will simulate fake OTP - 123456
 */

export const register = asyncHandler(async (req, res, next) => {
  const phone = req.body.phone;
  const admin = await getAdminByPhone(phone);
  checkPhoneExist(admin);

  // OTP processing eg. Sending OTP request to Operator
  const otpCheck = await getOtpByPhone(phone);
  const token = rand() + rand();
  let result;
  let otp = "123456";

  if (!otpCheck) {
    const otpData = {
      phone, // phone
      otp, // fake OTP
      rememberToken: token,
      count: 1,
    };

    result = await createOtp(otpData);
  } else {
    const lastRequest = new Date(otpCheck.updatedAt).toLocaleDateString();
    const isSameDate = lastRequest == new Date().toLocaleDateString();

    checkOtpErrorIfSameDate(isSameDate, otpCheck);

    if (!isSameDate) {
      const otpData = {
        otp,
        rememberToken: token,
        count: 1,
        error: 0,
      };
      result = await updateOtp(otpCheck.id, otpData);
    } else {
      if (otpCheck.count === 3) {
        const err: any = new Error(
          "OTP requests are allowed only 3 times per day. Please try again tomorrow,if you reach the limit."
        );
        err.status = 405;
        return next(err);
      } else {
        const otpData = {
          otp,
          rememberToken: token,
          count: {
            increment: 1,
          },
        };
        result = await updateOtp(otpCheck.id, otpData);
      }
    }
  }

  res.status(200).json({
    message: `We are sending OTP to 09${result.phone}.`,
    phone: result.phone,
    token: result.rememberToken,
  });
});

/*
 * POST localhost:8080/api/v1/verify-otp
 * Verify OTP app sent recently
 */

export const verifyOTP = [
  // Validate and sanitize fields.
  body("token", "Token must not be empty.").trim().notEmpty().escape(),
  body("phone", "Invalid Phone Number.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 })
    .escape(),
  body("otp", "OTP is not invalid.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 6 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const err: any = new Error("Validation failed!");
      err.status = 400;
      return next(err);
    }
    const { token, phone, otp } = req.body;

    const admin = await getAdminByPhone(phone);
    checkPhoneExist(admin);

    const otpCheck = await getOtpByPhone(phone);
    checkOtpPhone(otpCheck);

    // Wrong OTP allowed 5 times per day
    const lastRequest = new Date(otpCheck!.updatedAt).toLocaleDateString();
    const isSameDate = lastRequest == new Date().toLocaleDateString();
    checkOtpErrorIfSameDate(isSameDate, otpCheck);

    let result;

    if (otpCheck!.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      result = await updateOtp(otpCheck!.id, otpData);

      const err: any = new Error("Token is invalid.");
      err.status = 400;
      return next(err);
    }

    const difference = moment() - moment(otpCheck!.updatedAt);
    // console.log("Diff", difference);

    if (difference > 90000) {
      // expire at 1 min 30 sec
      const err: any = new Error("OTP is expired.");
      err.status = 403;
      return next(err);
    }

    if (otpCheck!.otp !== otp) {
      // ----- Starting to record wrong times --------
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        result = await updateOtp(otpCheck!.id, otpData);
      } else {
        const otpData = {
          error: {
            increment: 1,
          },
        };
        result = await updateOtp(otpCheck!.id, otpData);
      }
      // ----- Ending -----------
      const err: any = new Error("OTP is incorrect.");
      err.status = 401;
      return next(err);
    }

    const randomToken = rand() + rand() + rand();
    const otpData = {
      verifyToken: randomToken,
      count: 1,
      error: 1,
    };
    result = await updateOtp(otpCheck!.id, otpData);

    res.status(200).json({
      message: "Successfully OTP is verified",
      phone: result.phone,
      token: result.verifyToken,
    });
  }),
];

/*
 * POST localhost:8080/api/v1/confirm-password
 * Verify Token and set up password
 */

export const confirmPassword = [
  // Validate and sanitize fields.
  body("token", "Token must not be empty.").trim().notEmpty().escape(),
  body("phone", "Invalid Phone Number.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 })
    .escape(),
  body("password", "Password must be 8 digits.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 8, max: 8 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const err: any = new Error("Validation failed!");
      err.status = 400;
      return next(err);
    }
    const { token, phone, password } = req.body;

    const admin = await getAdminByPhone(phone);
    checkPhoneExist(admin);

    const otpCheck = await getOtpByPhone(phone);
    checkOtpPhone(otpCheck);

    if (otpCheck!.error === 5) {
      const err: any = new Error(
        "This request may be an attack. If not, try again tomorrow."
      );
      err.status = 401;
      return next(err);
    }

    let result;

    if (otpCheck!.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      result = await updateOtp(otpCheck!.id, otpData);

      const err: any = new Error("Token is invalid.");
      err.status = 400;
      return next(err);
    }

    const difference = moment() - moment(otpCheck!.updatedAt);
    // console.log("Diff", difference);

    if (difference > 300000) {
      // will expire after 5 min
      const err: any = new Error("Your request is expired. Please try again.");
      err.status = 403;
      return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const adminData = { phone: req.body.phone, password: hashPassword };
    const newAdmin = await createAdmin(adminData);

    // jwt token
    let payload = { id: newAdmin.id };
    const jwtToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {expiresIn: '1h'});

    res.status(201).json({
      message: "Successfully created an account.",
      token: jwtToken,
      user_id: newAdmin.id,
    });
  }),
];

/*
 * POST localhost:8080/api/v1/login
 * Login using phone and password
 */

export const login = [
  // Validate and sanitize fields.
  body("password", "Password must be 8 digits.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 8, max: 8 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const err: any = new Error("Validation failed!");
      err.status = 400;
      return next(err);
    }

    const { phone, password } = req.body;

    const admin = await getAdminByPhone(phone);
    checkPhoneIfNotExist(admin);

    // Wrong Password allowed 3 times per day
    if (admin!.status === "freeze") {
      const err: any = new Error(
        "Your account is temporarily locked. Please contact us."
      );
      err.status = 401;
      return next(err);
    }

    let result;

    const isEqual = await bcrypt.compare(password, admin!.password);
    if (!isEqual) {
      // ----- Starting to record wrong times --------
      const lastRequest = new Date(admin!.updatedAt).toLocaleDateString();
      const isSameDate = lastRequest == new Date().toLocaleDateString();

      if (!isSameDate) {
        const adminData = {
          error: 1,
        };
        result = await updateAdmin(admin!.id, adminData);
      } else {
        if (admin!.error >= 2) {
          const adminData = {
            status: "freeze",
          };
          result = await updateAdmin(admin!.id, adminData);
        } else {
          const adminData = {
            error: {
              increment: 1,
            },
          };
          result = await updateAdmin(admin!.id, adminData);
        }
      }
      // ----- Ending -----------
      const err: any = new Error("Password is wrong.");
      err.status = 401;
      return next(err);
    }

    if (admin!.error >= 1) {
      const adminData = {
        error: 0,
      };
      result = await updateAdmin(admin!.id, adminData);
    }

    let payload = { id: admin!.id };
    const jwtToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {expiresIn: '1h'});

    res.status(201).json({
      message: "Successfully Logged In.",
      token: jwtToken,
      user_id: admin!.id,
    });
  }),
];

const rand = () => Math.random().toString(36).substring(2);
