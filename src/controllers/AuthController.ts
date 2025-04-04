import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

  // Handles user account creation and sends a confirmation email
  static createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { password, email } = req.body;

      // Checks if the email is already in use
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(409).json({ message: "Usuario ya existe" });
        return;
      }

      // Creates a new user and hashes the password
      const user = new User(req.body);
      user.password = await hashPassword(password);

      // Generates a confirmation token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Sends confirmation email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        token: token.token,
        name: user.name,
      });

      // Saves both user and token in the database
      await Promise.all([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu email para confirmarla");
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // Confirms an account using a token from the email
  static confirmAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      // Checks if the token exists
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        res.status(400).json({ message: "Token no válido" });
        return;
      }

      // Finds the user associated with the token
      const user = await User.findById(tokenExists.user);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Marks the account as confirmed and deletes the token
      user.confirmed = true;
      await Promise.all([user.save(), tokenExists.deleteOne()]);

      res.json({ message: "Cuenta confirmada" });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  // Handles user login and JWT generation
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Checks if the account is confirmed
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // Resends confirmation email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          token: token.token,
          name: user.name,
        });

        res.status(401).json({ message: "La cuenta no ha sido confirmada, hemos enviado un email de confirmación" });
        return;
      }

      // Verifies password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return;
      }

      // Generates and sends JWT
      const token = generateJWT({ id: user.id });
      res.send(token);
      
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // Handles password reset requests by sending an email with a reset token
  static forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Creates a reset token
      const token = new Token();
      token.user = user.id;
      token.token = generateToken();
      await token.save();

      // Sends password reset email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        token: token.token,
        name: user.name,
      });

      res.send("Email de restablecimiento de contraseña enviado");
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // Validates if a password reset token is valid
  static validateToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        res.status(400).json({ message: "Token no válido" });
        return;
      }

      res.send("Token válido, crea tu nueva contraseña");
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // Updates the user password using a reset token
  static updatePasswordWithToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        res.status(400).json({ message: "Token no válido" });
        return;
      }

      // Finds the user and updates the password
      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(req.body.password);
      
      await Promise.all([user.save(), tokenExists.deleteOne()]);

      res.send("La contraseña ha sido actualizada");
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  // Returns the authenticated user's information
  static user = async (req: Request, res: Response): Promise<void> => {
      res.json(req.user);
      return;
  };
}
