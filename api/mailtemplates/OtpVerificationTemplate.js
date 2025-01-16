export const otpVerificationTemplate = (name, otp) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f4f4;
        }
        .email-wrapper {
          max-width: 600px;
          width: 100%;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007BFF;
          color: #ffffff;
          text-align: center;
          padding: 20px;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          font-size: 16px;
          line-height: 1.6;
          color: #333;
        }
        .otp {
          display: inline-block;
          background-color: #f4f4f4;
          color: #007BFF;
          font-size: 22px;
          font-weight: bold;
          padding: 15px 25px;
          margin: 20px 0;
          border-radius: 5px;
          border: 1px solid #ddd;
          text-align: center;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 14px;
          color: #777;
          background-color: #f9f9f9;
        }
        a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-wrapper">
          <div class="header">
            OTP Verification
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for signing up! Please use the OTP below to verify your account:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>
            <p>If you have any questions, reach out to us anytime at 
            <a href="mailto:info@realestate.com">info@realestate.com</a>.</p>
          </div>
          <div class="footer">
            &copy; 2024 Real Estate Aditya Vashsitha. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>`;
};
