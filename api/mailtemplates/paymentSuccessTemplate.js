export const paymentSuccessTemplate = (firstName, email, orderId, paymentId) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Success</title>
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
            background-color: #4CAF50;
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
          .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777;
            background-color: #f9f9f9;
          }
          a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="header">
              Payment Confirmation
            </div>
            <div class="content">
              <p>Dear <strong>${firstName}</strong>,</p>
              <p>Thank you for your payment! We have successfully received your payment. Below are your order details:</p>
              <div class="details">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Payment ID:</strong> ${paymentId}</p>
                <p><strong>Email:</strong> ${email}</p>
              </div>
              <p>If you have any questions, feel free to contact us at 
              <a href="mailto:support@example.com">support@example.com</a>.</p>
              <p>We appreciate your business and look forward to serving you again!</p>
            </div>
            <div class="footer">
              &copy; 2024 Real Estate Platform. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>`;
  };
  