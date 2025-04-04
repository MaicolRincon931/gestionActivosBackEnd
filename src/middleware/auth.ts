import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Extends Express Request to include user data after authentication
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// Middleware to authenticate users based on the JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    // If no token is provided, deny access
    if (!bearer) {
        res.status(401).json({ error: "No autorizado" });
        return;
    }

    const token = bearer.split(" ")[1];

    try {
        // Verifies the JWT and extracts user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("_id name email role");

            if (user) {
                req.user = user; // Attach user info to the request
                next(); // Proceed to the next middleware
            } else {
                res.status(401).json({ error: "Token no válido" });
            }
        }
    } catch (error) {
        res.status(401).json({ error: "Token no válido" });
    }
};
