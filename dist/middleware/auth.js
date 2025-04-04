"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Middleware to authenticate users based on the JWT token
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    // If no token is provided, deny access
    if (!bearer) {
        res.status(401).json({ error: "No autorizado" });
        return;
    }
    const token = bearer.split(" ")[1];
    try {
        // Verifies the JWT and extracts user data
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded.id) {
            const user = await User_1.default.findById(decoded.id).select("_id name email role");
            if (user) {
                req.user = user; // Attach user info to the request
                next(); // Proceed to the next middleware
            }
            else {
                res.status(401).json({ error: "Token no válido" });
            }
        }
    }
    catch (error) {
        res.status(401).json({ error: "Token no válido" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map