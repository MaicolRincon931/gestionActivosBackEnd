"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Route to create a new user account
router.post("/create-account", (0, express_validator_1.body)("name").notEmpty().withMessage("El campo nombre es obligatorio"), // Name field is required
(0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("El campo email es obligatorio"), // Email must be a valid format
(0, express_validator_1.body)("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El campo password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
(0, express_validator_1.body)("password_confirmation")
    .notEmpty()
    .custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden"); // Passwords must match
    }
    return true;
}), (0, express_validator_1.body)("role").notEmpty().withMessage("El campo role es obligatorio"), // Role field is required
validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
// Route to confirm an account using a token
router.post("/confirm-account", (0, express_validator_1.body)("token").notEmpty().withMessage("El campo token es obligatorio"), // Token field is required
validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
// Route for user login
router.post("/login", (0, express_validator_1.body)("email").notEmpty().withMessage("El campo email es obligatorio"), // Email is required
(0, express_validator_1.body)("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El password no puede ir vacío"), // Password cannot be empty
validation_1.handleInputErrors, AuthController_1.AuthController.login);
// Route to send password reset link
router.post("/forgot-password", (0, express_validator_1.body)("email").notEmpty().withMessage("El campo email es obligatorio"), // Email is required
validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
// Route to reset password using a token
router.post("/reset-password", (0, express_validator_1.body)("token").notEmpty().withMessage("El campo token es obligatorio"), // Token is required
(0, express_validator_1.body)("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
// Route to validate a token
router.post("/validate-token", (0, express_validator_1.body)("token").notEmpty().withMessage("El campo token es obligatorio"), // Token field is required
validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
// Route to update password using a token
router.post("/update-password/:token", (0, express_validator_1.param)('token').isNumeric().withMessage("Token no valido"), // Token must be numeric
(0, express_validator_1.body)("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El campo password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
(0, express_validator_1.body)("password_confirmation")
    .notEmpty()
    .custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden"); // Passwords must match
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
// Route to get user info (requires authentication)
router.get('/user', auth_1.authenticate, // Middleware to check if user is authenticated
AuthController_1.AuthController.user);
exports.default = router;
//# sourceMappingURL=authRouter.js.map