import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;         // full HTML content
  text?: string;        // optional fallback plain text
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: text ?? "Please view this email in HTML format"
  });
}
