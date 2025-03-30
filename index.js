import express from "express";
import dotenv from "dotenv";
// import connectDb from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import movieRoute from "./routes/movieRoute.js";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const connectDb = async (mongo_URl) => {
  try {
    await mongoose.connect(mongo_URl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message || "Connection error");
  }
};
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5174"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(5000, () => {
  connectDb(process.env.MONGO);
  console.log("Backend server is running");
});
