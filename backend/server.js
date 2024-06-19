import express from 'express'
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './db/connectDb.js';
import userRouter from "./routers/userRoutes.js";
import todoRouter from './routers/todoRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/todos/", todoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

