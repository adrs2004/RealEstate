export const forgotPasswordOtp = (email, name, otp) => {
  return `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password OTP</title>
            <style>
                body {
                    background-color: #f4f4f9;
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
        
                .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    overflow: hidden;
                    padding: 20px;
                }
        
                .header {
                    background-color: #007BFF;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
        
                .message {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 20px 0;
                    color: #007BFF;
                    text-align: center;
                }
        
                .body {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #555;
                    margin: 20px 0;
                    text-align: left;
                }
        
                .highlight {
                    font-weight: bold;
                    color: #333;
                }
        
                .otp {
                    display: block;
                    font-size: 32px;
                    font-weight: bold;
                    color: #007BFF;
                    text-align: center;
                    margin: 20px 0;
                }
        
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    padding: 20px 0;
                    border-top: 1px solid #eee;
                    margin-top: 20px;
                }
        
                a {
                    color: #007BFF;
                    text-decoration: none;
                }
        
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <div class="header">Forgot Password Request</div>
                <div class="message">Here is your OTP</div>
                <div class="body">
                    <p>Hi <span class="highlight">${name}</span>,</p>
                    <p>You requested to reset your password for the account associated with <span class="highlight">${email}</span>.</p>
                    <p>Please use the OTP below to proceed with resetting your password:</p>
                    <div class="otp">${otp}</div>
                    <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
                </div>
                <div class="footer">
                    Need help? Contact us at 
                    <a href="mailto:info@studynotion.com">info@realEstate.com</a>.<br>
                    &copy; ${new Date().getFullYear()} Real Estate. All Rights Reserved.
                </div>
            </div>
        </body>
        
        </html>`;
};
