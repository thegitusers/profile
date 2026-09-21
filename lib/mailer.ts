import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("EMAIL_USER/EMAIL_PASSWORD not set — skipping email send:", subject);
    return;
  }
  try {
    const fromName = process.env.EMAIL_FROM_NAME;
    await getTransporter().sendMail({
      from: fromName ? `"${fromName}" <${process.env.EMAIL_USER}>` : process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
