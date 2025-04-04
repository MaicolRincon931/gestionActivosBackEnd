"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    // Handles user account creation and sends a confirmation email
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            // Checks if the email is already in use
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                res.status(409).json({ message: "Usuario ya existe" });
                return;
            }
            // Creates a new user and hashes the password
            const user = new User_1.default(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            // Generates a confirmation token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Sends confirmation email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                token: token.token,
                name: user.name,
            });
            // Saves both user and token in the database
            await Promise.all([user.save(), token.save()]);
            res.send("Cuenta creada, revisa tu email para confirmarla");
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
    // Confirms an account using a token from the email
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            // Checks if the token exists
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                res.status(400).json({ message: "Token no válido" });
                return;
            }
            // Finds the user associated with the token
            const user = await User_1.default.findById(tokenExists.user);
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            // Marks the account as confirmed and deletes the token
            user.confirmed = true;
            await Promise.all([user.save(), tokenExists.deleteOne()]);
            res.json({ message: "Cuenta confirmada" });
            return;
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            return;
        }
    };
    // Handles user login and JWT generation
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            // Checks if the account is confirmed
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                // Resends confirmation email
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    token: token.token,
                    name: user.name,
                });
                res.status(401).json({ message: "La cuenta no ha sido confirmada, hemos enviado un email de confirmación" });
                return;
            }
            // Verifies password
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                res.status(401).json({ message: "Contraseña incorrecta" });
                return;
            }
            // Generates and sends JWT
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
    // Handles password reset requests by sending an email with a reset token
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            // Creates a reset token
            const token = new Token_1.default();
            token.user = user.id;
            token.token = (0, token_1.generateToken)();
            await token.save();
            // Sends password reset email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                token: token.token,
                name: user.name,
            });
            res.send("Email de restablecimiento de contraseña enviado");
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
    // Validates if a password reset token is valid
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                res.status(400).json({ message: "Token no válido" });
                return;
            }
            res.send("Token válido, crea tu nueva contraseña");
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
    // Updates the user password using a reset token
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                res.status(400).json({ message: "Token no válido" });
                return;
            }
            // Finds the user and updates the password
            const user = await User_1.default.findById(tokenExists.user);
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            await Promise.all([user.save(), tokenExists.deleteOne()]);
            res.send("La contraseña ha sido actualizada");
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
    // Returns the authenticated user's information
    static user = async (req, res) => {
        res.json(req.user);
        return;
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map