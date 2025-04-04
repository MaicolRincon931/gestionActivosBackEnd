"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErrors = void 0;
const express_validator_1 = require("express-validator");
// Middleware to handle input validation errors
const handleInputErrors = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    // If there are validation errors, return them to the client
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next(); // Continue if there are no errors
    return;
};
exports.handleInputErrors = handleInputErrors;
//# sourceMappingURL=validation.js.map