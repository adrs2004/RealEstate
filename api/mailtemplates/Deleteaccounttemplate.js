export const accountDeletionConfirmation = (email, name) => {
    return `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Deletion Confirmation</title>
            <style>
                body {
                    background-color: #f9f9f9;
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
                    background-color: #ff4b5c;
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
                    color: #ff4b5c;
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
        
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    padding: 20px 0;
                    border-top: 1px solid #eee;
                    margin-top: 20px;
                }
        
                a {
                    color: #ff4b5c;
                    text-decoration: none;
                }
        
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <div class="header">Real Estate</div>
                <div class="message">Account Deletion Confirmation</div>
                <div class="body">
                    <p>Hi <span class="highlight">${name}</span>,</p>
                    <p>We confirm that your account associated with the email <span class="highlight">${email}</span> has been successfully deleted.</p>
                    <p>If you did not request this action or if you believe this was done in error, please contact us immediately to resolve the issue.</p>
                </div>
                <div class="footer">
                    If you have any questions, feel free to reach out to us at 
                    <a href="mailto:info@realestate.com">info@realestate.com</a>.<br>
                    &copy; ${new Date().getFullYear()} Real Estate. All Rights Reserved.
                </div>
            </div>
        </body>
        
        </html>`;
  };
  