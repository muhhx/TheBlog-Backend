import nodemailer from "nodemailer";
import config from "config";

interface IEmail {
    to: string,
    subject: string,
    html: string
}

export function htmlMail(endpoint: String, token: String) {
    const url = config.get<string>("url");

    const link = `${url}/${endpoint}/${token}`;

    const html = `<a href=${link} clicktracking=off>Click here to reset your password OR confirm your email</a>`;

    return html;
}

export async function sendMail(options: IEmail) {
    const service = config.get<string>("nodemailerService");
    const user = config.get<string>("nodemailerUser");
    const pass = config.get<string>("nodemailerPass");

    const transporter = nodemailer.createTransport({
        service,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user,
            pass 
        }
    });

    const mailOptions = {
        from: user,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    try {
        const response = await transporter.sendMail(mailOptions)

        return response;
    } catch (error) {
        return null;
    }
}
