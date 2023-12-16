import "express-async-errors";
import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//router
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

//middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//for profile images in public folder to make assets publicly available
app.use(
  express.static(path.resolve(__dirname, "./client/dist"))
);
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

//point to index.html in public folder

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "./client/dist", "index.html")
  );
});

//If none of the rotes match
//NOT FOUND MIDDLEWARE
app.use("*", (req, res) => {
  res.status(404).json({ msg: `Not found` });
});
//error handling middleware
//ERROR MIDDLEWARE
app.use(errorHandlerMiddleware);

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on port ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
