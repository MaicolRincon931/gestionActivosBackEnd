import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Route to create a new user account
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El campo nombre es obligatorio"), // Name field is required
  body("email").notEmpty().isEmail().withMessage("El campo email es obligatorio"), // Email must be a valid format
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El campo password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
  body("password_confirmation")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden"); // Passwords must match
      }
      return true;
    }),
  body("role").notEmpty().withMessage("El campo role es obligatorio"), // Role field is required
  handleInputErrors,
  AuthController.createAccount
);

// Route to confirm an account using a token
router.post(
  "/confirm-account", 
  body("token").notEmpty().withMessage("El campo token es obligatorio"), // Token field is required
  handleInputErrors,
  AuthController.confirmAccount
);

// Route for user login
router.post(
  "/login",
  body("email").notEmpty().withMessage("El campo email es obligatorio"), // Email is required
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El password no puede ir vacío"), // Password cannot be empty
  handleInputErrors,
  AuthController.login
);

// Route to send password reset link
router.post(
  "/forgot-password",
  body("email").notEmpty().withMessage("El campo email es obligatorio"), // Email is required
  handleInputErrors,
  AuthController.forgotPassword
);

// Route to reset password using a token
router.post(
  "/reset-password",
  body("token").notEmpty().withMessage("El campo token es obligatorio"), // Token is required
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
  handleInputErrors,
  AuthController.forgotPassword
);

// Route to validate a token
router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El campo token es obligatorio"), // Token field is required
  handleInputErrors,
  AuthController.validateToken
);

// Route to update password using a token
router.post(
  "/update-password/:token",
  param('token').isNumeric().withMessage("Token no valido"), // Token must be numeric
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("El campo password debe tener al menos 6 caracteres"), // Password must be at least 6 characters
  body("password_confirmation")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden"); // Passwords must match
      }
      return true;
    }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

// Route to get user info (requires authentication)
router.get('/user',
  authenticate, // Middleware to check if user is authenticated
  AuthController.user
);

export default router;
