const nodemailer = require("nodemailer");

interface IEmail {
  to: string;
  subject: string;
  html: string;
}

export function htmlMail(endpoint: String, token: String) {
  const origin = process.env.ORIGIN;

  const link = `${origin}/${endpoint}/${token}`;

  const html = `<a href=${link} clicktracking=off>Click here to reset your password OR confirm your email</a>`;

  return html;
}

export async function sendMail(options: IEmail) {
  const service = process.env.NODEMAILER_SERVICE;
  const user = process.env.NODEMAILER_USER;
  const pass = process.env.NODEMAILER_PASS;
  const host = process.env.NODEMAILER_HOST;
  const port = process.env.NODEMAILER_PORT;

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
