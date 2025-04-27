import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = new Resend(RESEND_API_KEY);

export const sendPremiumConfirmationEmail = async (
    userEmail: string,
    userName: string
) => {
        
        try {
            const htmlTemplate = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f7f7f7;
                    color: #333;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    font-size: 24px;
                    color: #333;
                    text-align: center;
                  }
                  p {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #555;
                    text-align: center;
                  }
                  .cta-button {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    text-align: center;
                  }
                  .cta-button:hover {
                    background-color: #45a049;
                  }
                  .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                  }
                  .footer a {
                    color: #777;
                    text-decoration: none;
                  }
                  @media (max-width: 600px) {
                    .container {
                      padding: 15px;
                    }
                    h1 {
                      font-size: 22px;
                    }
                    p {
                      font-size: 14px;
                    }
                    .cta-button {
                      padding: 10px 15px;
                    }
                  }
                </style>
                <title>Welcome to Premium</title>
              </head>
              <body>
                <div class="container">
                  <h1>Welcome to Premium!</h1>
                  <p>Hi <strong>${userName}</strong>,</p>
                  <p>We're thrilled to have you as part of our premium membership. You're now a Premium user and can enjoy all the exclusive features!</p>
                  <p>Thank you for supporting us, and we hope you enjoy the perks that come with your new status. If you have any questions, feel free to reach out to us at any time.</p>
                  <p><a href="#" class="cta-button">Start Exploring Premium Features</a></p>
                  <div class="footer">
                    <p>If you didn't sign up for Premium, please disregard this email.</p>
                    <p>Contact us: <a href="mailto:support@sanrakshan.xyz">support@sanrakshan.xyz</a></p>
                    <p>&copy; 2025 Sanrakshan. All rights reserved.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        
            const emailResponse = await resend.emails.send({
              from: 'support@sanrakshan.xyz', // Use your custom sender email
              to: userEmail,
              subject: 'Welcome to Premium!',
              html: htmlTemplate,
            });
        // console.log(a);
        
    } catch (error) {
        console.error(error);
    }
};
