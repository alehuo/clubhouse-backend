import nodemailer from "nodemailer";
import { logger } from "../logger";

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT || "587",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
} as nodemailer.TransportOptions);

// Use JSON transport if the environment is something else than production
if (process.env.NODE_ENV !== "production") {
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
}

export const sendEmail = async (
  to: string[],
  subject: string,
  text: string,
  htmlString: string
) => {
  const addr = process.env.MAIL_FROM_ADDRESS || "clubhouse.example.com";
  const name = process.env.MAIL_FROM_NAME || "Clubhouse";
  const from = '"' + name + '" <' + addr + ">";

  const mailOptions = {
    from,
    bcc: to.join(", "),
    subject,
    text,
    htmlString
  };

  if (process.env.ENABLE_EMAIL_SENDING) {
    const res = await transporter.sendMail(mailOptions);

    // Debug output
    if (process.env.NODE_ENV !== "production") {
      logger.log("info", "Message sent: " + res.messageId);
      logger.log("info", "Message sent: " + res.message);
      // Preview only available when sending through an Ethereal account
      logger.log("info", "Preview URL: " + nodemailer.getTestMessageUrl(res));
    }
  }
};
