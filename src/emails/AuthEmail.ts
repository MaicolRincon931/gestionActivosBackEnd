import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  token: string;
  name: string;
}

export class AuthEmail {
  // Sends an account confirmation email with a verification token
  static sendConfirmationEmail = async (user: IEmail) => {
    await transporter.sendMail({
      from: "gestionactivos_prueba@gmail.com",
      to: user.email,
      subject: "Confirmación de cuenta",
      html: `
            <h1>Confirmación de cuenta</h1>
            <p>Confirma tu cuenta para comenzar a usar el sistema, visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
            <p>Ingresa este código: <b>${user.token}</b></p>
            <p>Este token es válido por 10 minutos.</p>
            `,
    });
  };

  // Sends an email with a password reset token
  static sendPasswordResetToken = async (user: IEmail) => {
    await transporter.sendMail({
      from: "gestionactivos_prueba@gmail.com",
      to: user.email,
      subject: "Restablece tu contraseña",
      html: `
            <h1>Solicitud de restablecimiento de contraseña</h1>
            <p>Para restablecer tu contraseña, visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
            <p>Ingresa este código: <b>${user.token}</b></p>
            <p>Este token es válido por 10 minutos.</p>
            `,
    });
  };
}
