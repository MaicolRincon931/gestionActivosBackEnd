"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Email server configuration
const config = {
    host: process.env.SMTP_HOST,
    port: +process.env.PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
// Create a transporter instance to send emails
exports.transporter = nodemailer_1.default.createTransport(config);
//# sourceMappingURL=nodemailer.js.map