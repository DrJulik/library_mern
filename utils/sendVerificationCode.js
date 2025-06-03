import sendEmail from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export default async function sendVerificationCode(email, verificationCode) {
  const message = generateVerificationOtpEmailTemplate(verificationCode);
  try {
    await sendEmail({
      email,
      subject: "Email Verification Code",
      message,
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw new Error("Error sending verification code");
  }
}
