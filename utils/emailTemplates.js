export const generateVerificationOtpEmailTemplate = (verificationCode) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email Verification</h2>
          <p>Thank you for registering! Please use the following verification code to verify your email address:</p>
          <div class="code">${verificationCode}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}; 

export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Here's your password reset link:</p>
          <div class="code">${resetPasswordUrl}</div>
          <p>If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
          <p>For security reasons, never share this link with anyone.</p>
        </div>
      </body>
    </html>
  `;
};