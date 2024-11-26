import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());



//routes
import userRoute from "./routes/user.routes";

app.use("/api/auth", userRoute);


export { app };