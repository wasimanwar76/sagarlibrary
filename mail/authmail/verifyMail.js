import { verifyMailtransporter } from "../mailconfig.js";
const { PROJECTURL } = process.env;

export const verifyEmail = async ({ name, email }, token) => {
  const mailOptions = {
    from: "Sagar Library",
    to: email,
    subject: "Verify Your Email Address for Sagar Library",
    html: `
  Dear ${name},
  <h1>Thank you for registering with Sagar Library!</h1>
  <b>To activate your account and start exploring our collection, please verify your email address by clicking the link below:
  <a href=${PROJECTURL}/api/v1/auth/verify-email/${token}>Verify Email Address Link </a>
  This link will expire in 24 hours. If you did not create an account with us, you can disregard this email.
  If you need any assistance or have questions, our support team is here to help. </b>
  <h1> Welcome to Sagar Library! </h1>
  <h1> Best regards,</h1>
  <h1> The Sagar Library Team </h1>
  `,
  };

  verifyMailtransporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });

  return true;
};
