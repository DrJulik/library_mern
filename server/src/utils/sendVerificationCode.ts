import sendEmail from './sendEmail';
import { generateVerificationOtpEmailTemplate } from './emailTemplates';

export default async function sendVerificationCode(
  email: string,
  verificationCode: number
): Promise<void> {
  const message = generateVerificationOtpEmailTemplate(verificationCode);
  
  try {
    await sendEmail({
      email,
      subject: 'Email Verification Code - Library Management System',
      message,
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error('Error sending verification code');
  }
}

