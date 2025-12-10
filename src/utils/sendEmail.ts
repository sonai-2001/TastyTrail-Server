import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface TemplateData {
  [key: string]: any;
  text?: string; // fallback text if not using EJS
}

export async function sendEmail(
  to: string,
  subject: string,
  templateName?: string,
  templateData?: TemplateData
) {
  let html: string | undefined = undefined;

  // Render EJS template if templateName is provided
  if (templateName && templateData) {
    const templatePath = path.join(__dirname, "../emails", `${templateName}.ejs`);
    html = (await ejs.renderFile(templatePath, templateData)) as string;
  }

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
    text: html ? undefined : templateData?.text // fallback plain text
  });
}
