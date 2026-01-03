import express from "express";
import type { Express, Request, Response } from "express";
import { config } from "dotenv";
import type { OutputMsg } from "./dtos/OutputMessage.js";
import mainRouter from "./routes/indexRoutes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import webhookRoutes from "./routes/webhook.routes.js";
import cors from "cors";

config();

const dbConnectionString = process.env.DB_Connection;
if (!dbConnectionString) {
    throw new Error("No DB Connection String Provided in environment variables.");
}
mongoose.connect(dbConnectionString).then(()=>{
    console.log("Connected to Database...");
}).catch((err)=>{
    console.log("Database connection failed:", err);
});

const app:Express = express();

app.use(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

if (process.env.NODE_ENV === "production") {
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }));
} else {
    app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req:Request, res:Response<OutputMsg>) => {
    const output: OutputMsg = {
        statusCode: 200,
        success: true,
        message: "Your App Is Live",
        data: res.cookie
    }
    res.json(output);
});

app.use("/api/v1", mainRouter);

const PORT:Number = Number(process.env.PORT)

app.listen(4000, ()=>{
    console.log(`Listening to port ${PORT}`);
})