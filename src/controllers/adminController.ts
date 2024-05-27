import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { unlink } from "node:fs/promises";
import path from "path";

import { getAdminById } from "../services/adminService";
import { updateAdmin } from "../services/authService";
import { checkAdmin } from "../utils/auth";
import { checkUploadFile } from "../utils/file";

// Extend the Request interface to include the adminId property
interface CustomRequest extends Request {
  adminId?: number; // or string, depending on your ID type
  file?: any;
}

export const uploadProfile = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // const id = req.params.id;
    const id = req.adminId;
    const image = req.file;
    // console.log("Multiple Images array", req.files);  // For multiple files uploaded

    const admin = await getAdminById(id!);
    checkAdmin(admin);
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

export const index = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});

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
