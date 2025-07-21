import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
import entryRoutes from "./routes/entryRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Update these URLs for your production deployment
const allowedOrigins = [
  "http://localhost:5173", // Localhost for development
  "https://money-talks-ruddy.vercel.app/", // Vercel frontend URL
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// connect to DB
connectDB();

// Basic API test route
app.get("/", (req, res) => res.send("API Working."));

// API ENDPOINTS
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/entries", entryRoutes);

app.listen(port, () => console.log(`Server started at port ${port}`));
