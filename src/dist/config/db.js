"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const node_process_1 = require("node:process");
// Connect to the database
const connectDB = async () => {
    try {
        // Try to establish the connection
        const connection = await mongoose_1.default.connect(process.env.DATABASE_URL);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        // Log success message with the connection details
        console.log(colors_1.default.cyan.bold(`MongoDB Conectado en : ${url}`));
    }
    catch (error) {
        // If connection fails, print an error and stop the process
        console.log(colors_1.default.red.bold('Error al conectador a MongoDB'));
        (0, node_process_1.exit)(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map