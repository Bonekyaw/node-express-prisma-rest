import "dotenv/config";
import { PrismaClient } from "@prisma/client"; // { Prisma, PrismaClient }
const moment = require("moment");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getAdminByPhone = async (phone: string) => {
  return prisma.admin.findUnique({
    where: { phone: phone }, // { phone }
  });
};

export const getOtpByPhone = async (phone: string) => {
  return prisma.otp.findUnique({
    where: { phone: phone }, // { phone }
  });
};

export const createOtp = async (otpData: any) => {
  return prisma.otp.create({ data: otpData });
};

export const updateOtp = async (id: number, otpData: any) => {
  return prisma.otp.update({
    where: { id: id },
    data: otpData,
  });
};

export const createAdmin = async (adminData: any) => {
  return prisma.admin.create({ data: adminData });
};

export const updateAdmin = async (id: number, adminData: any) => {
  return prisma.admin.update({
    where: { id: id },
    data: adminData,
  });
};

export const getAllAdmins = async ( filteredData: any ) => {
  return await prisma.admin.findMany( filteredData );
};
