import * as nodemailer from "nodemailer";

let transporter: any = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT || "587",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
} as nodemailer.TransportOptions);

if (process.env.NODE_ENV === "test") {
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
  const mailOptions: any = {
    from: '"Clubhouse" <clubhouse@example.com>',
    bcc: to.join(", "),
    subject,
    text,
    htmlString
  };
  const res: any = await transporter.sendMail(mailOptions);

  if (
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
  ) {
    console.log("Message sent: %s", res.messageId);
    console.log("Sent message: ", res.message);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(res));
  }
};
