import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    adminId?: number; // or the appropriate type for adminId, e.g., number
    file?: any;
  }
}