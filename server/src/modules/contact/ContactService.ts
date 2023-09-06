import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ADDRESS,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_ACCOUNT,
      pass: process.env.SMTP_PASSWORD,
    },
})

export const  emailOption = (sender:string) => {
    return {
        from: process.env.SMTP_ACCOUNT,
        to: 'jeff.lam@ctint.com'
    }
}