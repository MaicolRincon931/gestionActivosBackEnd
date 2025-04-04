"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const db_1 = require("./config/db");
const assetRouter_1 = __importDefault(require("./routes/assetRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
// Load environment variables from .env file
dotenv_1.default.config();
// Connect to the database
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsConfig)); // Enable CORS with custom config
app.use((0, morgan_1.default)('dev')); // Logging middleware for requests
app.use(express_1.default.json()); // Middleware to parse JSON requests
// Define API routes
app.use("/api/auth", authRouter_1.default); // Routes for authentication
app.use('/api/assets', assetRouter_1.default); // Routes for asset management
exports.default = app;
//# sourceMappingURL=server.js.map