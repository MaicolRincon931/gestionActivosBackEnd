import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Middleware to handle input validation errors
export const handleInputErrors = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let errors = validationResult(req);

    // If there are validation errors, return them to the client
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next(); // Continue if there are no errors
    return;
};
