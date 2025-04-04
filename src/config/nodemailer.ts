import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Email server configuration
const config =  {
    host: process.env.SMTP_HOST,  
    port: +process.env.PORT,      
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS  
    }
}

// Create a transporter instance to send emails
export const transporter = nodemailer.createTransport(config);
