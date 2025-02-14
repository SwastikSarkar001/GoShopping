import { EMAIL_APP_HOST, EMAIL_APP_PASSWORD } from "constants/env";
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import ApiError from "./ApiError";
import { BAD_REQUEST } from "constants/http";
import logger from "./logger";

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