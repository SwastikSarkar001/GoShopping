import { EMAIL_APP_HOST, EMAIL_APP_PASSWORD } from "constants/env";
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import { BAD_REQUEST, OK } from "constants/http";
import asyncHandler from "./asyncHandler";
import logger from "./logger";
import { emailVerificationTemplate } from "./Mails";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_APP_HOST,
    pass: EMAIL_APP_PASSWORD,
  },
  pool: true,  // Enables connection pooling
  maxConnections: 5,  // Allow up to 5 parallel connections
  maxMessages: 10,  // Reuse a connection for up to 10 emails
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error(error)
  } else {
    console.log("Server is ready to send email messages")
  }
})

export async function sendEmail(receiver: Mail.Options) {
  if (!receiver.to) {
    throw new Error('Please provide recipient email address of the user')
  }
  const email: string = receiver.to.toString()
  const body = receiver.html as string
  const receiverMail: Mail.Options = {
    from: '"eazzyBizz" <no-reply@eazzybizz.com>',
    to: email,
    subject: receiver.subject, // Subject line
    html: body // html body
  }
  const info = await transporter.sendMail(receiverMail);
  logger.info(`Message sent: ${info.messageId}`);
  if (!info) {
    logger.error('Email not sent')
    throw new ApiError(BAD_REQUEST, 'Email not sent');  // Throw custom error
  }
  else {
    logger.info(`Email sent successfully to address ${email}`)
  }
}

export const sendMail = asyncHandler (
  async (req, res, next) => {
    try {
      const fullname: string = ((req.body.fname) ? req.body.fname : 'user') + ((req.body.mname) ? ' ' + req.body.mname : '') + ((req.body.fname) ? ' ' + req.body.lname : '')
      const email: string = req.body.email
      if (!email) {
        throw new ApiError(BAD_REQUEST, 'Please provide recipient email address of the user')
      }
      const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
      const body = (emailVerificationTemplate.body as string)
        .replace("[OTP Number]", otp.toString())
        .replace("[User's Name]", fullname)
      const receiver: Mail.Options = {
        from: '"eazzyBizz" <no-reply@eazzybizz.com>',
        to: req.body.email,
        subject: emailVerificationTemplate.subject, // Subject line
        html: body // html body
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