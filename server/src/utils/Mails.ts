import Mail from "nodemailer/lib/mailer"

type templateType = {
  subject: Mail.Options['subject'],
  body: Mail.Options['html']
}

export const emailVerificationTemplate: templateType = {
  subject: 'Verify Your Email Address for eazzyBizz',
  body:
  `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 20px;
            }
            .content {
                padding: 20px;
                line-height: 1.6;
                color: #333333;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                background-color: #f1f1f1;
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                Verify Your Email for eazzyBizz
            </div>
            <div class="content">
                <p>Hi [User's Name],</p>
                <p>Thank you for signing up for eazzyBizz! To continue your registration, please verify your email address by entering the following One-Time Password (OTP):</p>
                <div class="otp">[OTP Number]</div>
                <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
                <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                <p>Welcome to the eazzyBizz community!</p>
                <p>Best Regards,<br>  
                The eazzyBizz Team</p>
            </div>
            <div class="footer">
                If you have any questions, feel free to contact us at <a href="mailto:support@eazzybizz.com">support@eazzybizz.com</a>.  
            </div>
        </div>
    </body>
    </html>
  `
}

export const welcomeToEazzyBizzTemplate: templateType = {
    subject: 'Welcome to eazzyBizz! Your Journey Starts Here.',
    body:
    `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    font-size: 20px;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333333;
                }
                .cta-button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    background-color: #f1f1f1;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888888;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    Welcome to eazzyBizz!
                </div>
                <div class="content">
                    <p>Hi [User's Name],</p>
                    <p>Welcome to <strong>eazzyBizz</strong>, where business meets efficiency! We're excited to have you on board.</p>
                    <p>Your account has been successfully created, and you're all set to start managing your enterprise operations seamlessly.</p>
                    <p>We believe that eazzyBizz will help you streamline processes and boost productivity within your business.</p>
                    <p>To get started, simply click the button below:</p>
                    <a href="https://eazzybizz.com/features" class="cta-button">Explore eazzyBizz</a>
                    <p>If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:support@eazzybizz.com">support@eazzybizz.com</a>.</p>
                    <p>We look forward to seeing you thrive with eazzyBizz!</p>
                    <p>Best Regards,<br>  
                    The eazzyBizz Team</p>
                </div>
                <div class="footer">
                    If you didn't sign up for eazzyBizz, please ignore this email or contact our support team.
                </div>
            </div>
        </body>
        </html>
    `
}