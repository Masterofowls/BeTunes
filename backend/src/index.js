import dotenv from "dotenv";
import express from "express";
import fileUpload from 'express-fileupload';
import path from 'path';

import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import statRoutes from "./routes/stat.route.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";

import { clerkMiddleware } from '@clerk/express'


dotenv.config();

const app = express();
const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
}))

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message });
})

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
    connectDB()
})