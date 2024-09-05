import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

import path from "path";

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
// console.log(__dirname);
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
};
app.use(cors(corsOptions));

// yha api aayegi

app.use("/api/v2/user", userRoute);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);
// "http://localhost:800/api/v1/user/register"

app.use(express.static(path.join(__dirname, "/FrontEnd/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "FrontEnd", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
