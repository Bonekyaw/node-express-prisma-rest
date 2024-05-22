import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
// import bodyParser from 'body-parser';

import { limiter } from "./middlewares/rateLimiter";
import adminRoutes from "./routes/v1/admin";
import authRoutes from "./routes/v1/auth";

const app = express();

app.use(helmet());

app.use(express.json()); // application/json
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use(compression());
app.use(cors());
// app.options("*", cors());

app.use(limiter);

app.use("/api/v1", authRoutes);
app.use("/api/v1", adminRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({ error: message });
});