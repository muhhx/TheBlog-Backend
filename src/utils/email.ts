import nodemailer from "nodemailer";
import config from "config";

interface IEmail {
  to: string;
  subject: string;
  html: string;
}

export function htmlMail(endpoint: String, token: String) {
  const origin = config.get<string>("origin");

  const link = `${origin}/${endpoint}/${token}`;

  const html = `<a href=${link} clicktracking=off>Click here to reset your password OR confirm your email</a>`;

  return html;
}

export async function sendMail(options: IEmail) {
  const service = config.get<string>("nodemailerService");
  const user = config.get<string>("nodemailerUser");
  const pass = config.get<string>("nodemailerPass");
  const host = config.get<string>("nodemailerHost");
  const port = config.get<number>("nodemailerPort");

  const transporter = nodemailer.createTransport({
    service,
    host,
    port,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const response = await transporter.sendMail(mailOptions);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}
