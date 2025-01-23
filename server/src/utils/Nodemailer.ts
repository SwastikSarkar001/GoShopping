import { EMAIL_APP_HOST, EMAIL_APP_PASSWORD } from "constants/env";
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import { BAD_REQUEST, OK } from "constants/http";
import asyncHandler from "./asyncHandler";
import logger from "./logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_APP_HOST,
    pass: EMAIL_APP_PASSWORD,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log("Server is ready to send email messages")
  }
});

const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

const htmlBody: { subject: Mail.Options['subject'], body: Mail.Options['html'] } = {
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
                <div class="otp">${otp}</div>
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




export const sendMail = asyncHandler (
  async (req, res, next) => {
    try {
      const fullname: string = ((req.body.fname) ? req.body.fname : 'user') + ((req.body.mname) ? ' ' + req.body.mname : '') + ((req.body.fname) ? ' ' + req.body.lname : '')
      const email: string = req.body.email
      if (!email) {
        throw new ApiError(BAD_REQUEST, 'Please provide recipient email address of the user')
      }
      const body = htmlBody.body as string
      const receiver: Mail.Options = {
        from: '"eazzyBizz" <no-reply@eazzybizz.com>',
        to: req.body.email,
        subject: htmlBody.subject, // Subject line
        html: body.replace("[User's Name]", fullname) // html body
      }
      const info = await transporter.sendMail(receiver);
      console.log("Message sent: %s", info.messageId);
      if (!info) {
        throw new ApiError(BAD_REQUEST, 'Email not sent');  // Throw custom error
      }
      logger.info(`OTP sent successfully to address ${req.body.email}`)
      res.status(OK).json(
        new ApiResponse(OK, [info], `OTP sent successfully to address ${req.body.email}`)
      )
    }
    catch (err) {
      next(err)
    }
  }
)