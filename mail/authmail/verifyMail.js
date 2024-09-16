import { verifyMailtransporter } from "../mailconfig.js";
const { PROJECTURL } = process.env;

export const verifyEmail = async ({ name, email }, token) => {
  const mailOptions = {
    from: "Sagar Library",
    to: email,
    subject: "Verify Your Email Address for Sagar Library",
    html: `
    Dear ${name},
<h1 style="color: #2c3e50; font-family: Arial, sans-serif;">Thank you for registering with Sagar Library!</h1> <p style="font-family: Arial, sans-serif;">To activate your account and start exploring our collection, please verify your email address by clicking the link below:</p> <p style="font-family: Arial, sans-serif;"> <a href="${PROJECTURL}/api/v1/auth/verify-email/${token}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a> </p> <p style="font-family: Arial, sans-serif;">This link will expire in 24 hours. If you did not create an account with us, you can disregard this email.</p> <p style="font-family: Arial, sans-serif;">If you need any assistance or have questions, our support team is here to help.</p> <h1 style="color: #2c3e50; font-family: Arial, sans-serif;">Welcome to Sagar Library!</h1> <p style="font-family: Arial, sans-serif;">Best regards,</p> <h1 style="color: #2c3e50; font-family: Arial, sans-serif;">The Sagar Library Team</h1>
  `,
  };

  verifyMailtransporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });

  return true;
};
