import asyncHandler from "express-async-handler";

import { getAllAdmins } from "../services/authService";

export const index = asyncHandler(async (req, res, next) => {
  const filteredData = {
    select: {
      name: true,
      phone: true,
      status: true,
    },
  };
  const admins = await getAllAdmins(filteredData);

  res.status(200).json({
    message: "This is just an example. In real app, you should check auth.",
    admins,
  });
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
