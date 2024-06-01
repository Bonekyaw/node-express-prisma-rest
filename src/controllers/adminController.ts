import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { unlink } from "node:fs/promises";
import path from "path";
import { body, query, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client"; // { Prisma, PrismaClient }
const prisma = new PrismaClient();

import { getAdminById } from "../services/adminService";
import { updateAdmin } from "../services/authService";
import { checkUploadFile } from "../utils/file";
import { offset, noCount, cursor } from "../utils/paginate";

// Extend the Request interface to include the adminId property
interface CustomRequest extends Request {
  adminId?: number; // or string, depending on your ID type
  file?: any;
  admin?: any;
}

export const uploadProfile = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // const id = req.params.id;
    const id = req.adminId;
    const image = req.file;
    // console.log("Multiple Images array", req.files);  // For multiple files uploaded

    const admin = req.admin;

    checkUploadFile(image);
    const imageUrl = image.path.replace("\\", "/");

    if (admin!.profile) {
      // await unlink(admin!.profile); // Delete an old profile image because it accepts just one.
      try {
        await unlink(path.join(__dirname, "../..", admin!.profile));
      } catch (error) {
        const adminData = {
          profile: imageUrl,
        };
        await updateAdmin(id!, adminData);
      }
    }

    const adminData = {
      profile: imageUrl,
    };
    await updateAdmin(id!, adminData);

    res
      .status(200)
      .json({ message: "Successfully uploaded the image.", profile: imageUrl });
  }
);

export const index = [
  // Validate and sanitize fields.
  query("page", "Page number must be integer.").isInt({ gt: 0 }).toInt(),
  query("limit", "Limit number must be integer.").isInt({ gt: 0 }).toInt(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const err: any = new Error("Validation failed!");
      err.status = 400;
      return next(err);
    }

    const { page, limit } = req.query;
    // const limit = req.query.limit;
    // const cursors = req.query.cursor ? { id: +req.query.cursor } : null;

    // Authorization - if it is "user" role, no one is allowed.
    // Same as - authorise(true, admin, "super", "manager", "editor")
    // authorise(false, admin, "user");

    const filters = { status: "active" };
    const order = { id: "desc" };
    const fields = {
      name: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      profile: true,
      createdAt: true,
    };

    const admins = await offset(
      prisma.admin,
      page,
      limit,
      filters,
      order,
      fields
    );
    // const admins = await noCount(prisma.admin, page, limit, filters, order, fields);
    // const admins = await cursor(
    //   prisma.admin,
    //   cursors,
    //   limit,
    //   filters,
    //   order,
    //   fields
    // );
    res.status(200).json(admins);
  }),
];

export const store = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});

export const show = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});

export const update = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});

export const destroy = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});
