import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import assetRouter from './routes/assetRouter';
import authRouter from './routes/authRouter';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(cors(corsConfig)); // Enable CORS with custom config
app.use(morgan('dev')); // Logging middleware for requests
app.use(express.json()); // Middleware to parse JSON requests

// Define API routes
app.use("/api/auth", authRouter); // Routes for authentication
app.use('/api/assets', assetRouter); // Routes for asset management

export default app;
