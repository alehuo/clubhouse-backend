import nodemailer from "nodemailer";

let transporter: any = nodemailer.createTransport({
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

export const sendEmail: (
  to: string[],
  subject: string,
  text: string,
  htmlString: string
) => Promise<any> = async (
  to: string[],
  subject: string,
  text: string,
  htmlString: string
): Promise<any> => {
  const addr: string = process.env.MAIL_FROM_ADDRESS || "clubhouse.example.com";
  const name: string = process.env.MAIL_FROM_NAME || "Clubhouse";
  const from: string = '"' + name + '" <' + addr + ">";

  const mailOptions: any = {
    from,
    bcc: to.join(", "),
    subject,
    text,
    htmlString
  };

  if (process.env.ENABLE_EMAIL_SENDING) {
    const res: any = await transporter.sendMail(mailOptions);

    // Debug output
    if (process.env.NODE_ENV !== "production") {
      console.log("Message sent: %s", res.messageId);
      console.log("Sent message: ", res.message);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(res));
    }
  }
};
