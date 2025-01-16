export const signuptemplate = (email, name) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td align="center" style="background-color: #007BFF; color: #ffffff; padding: 20px; font-size: 24px; font-weight: bold;">
                                Welcome to Real Estate Aditya Vashsitha
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left; font-size: 16px; line-height: 1.6; color: #333;">
                                <p>Hi <strong>${name}</strong>,</p>
                                <p>We’re excited to have you join us! Thank you for signing up for our service.</p>
                                <p>Your registered email is <span style="font-weight: bold; color: #007BFF;">${email}</span>.</p>
                                <p>If you did not sign up for this account, please contact us immediately to secure your account.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; font-size: 14px; color: #555;">
                                <p>If you have any questions, reach out to us anytime at 
                                <a href="mailto:info@realestate.com" style="color: #007BFF; text-decoration: none;">info@realestate.com</a>.</p>
                                <p>We’re here to help!</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color: #f4f4f4; padding: 10px; font-size: 12px; color: #999;">
                                &copy; 2024 Real Estate Aditya Vashsitha. All rights reserved.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};
