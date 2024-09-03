import express,{urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server,  } from "./socket/socket.js";

dotenv.config({});

const PORT = process.env.PORT || 3000;

app.get("/",(_,res)=>{
    return res.status(200).json({
        message:"I'm coming from backend",
        success:true
    })
})
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));

// yha api aayegi

app.use("/api/v2/user",userRoute);
app.use("/api/v2/post",postRoute);
app.use("/api/v2/message",messageRoute);
// "http://localhost:800/api/v1/user/register"n
server.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})