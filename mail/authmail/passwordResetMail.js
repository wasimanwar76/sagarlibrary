import { verifyMailtransporter } from "../mailconfig.js";
const { PROJECTURL } = process.env;

export const passwordResetMail = async ({ name, email }, token) => {
  const mailOptions = {
    from: "Sagar Library",
    to: email,
    subject: "Password Reset Request from Sagar Library",
    html: `
    Dear ${name},
                <p>You requested to reset your password. Please click the link below to reset your password:</p>
                <a href="${PROJECTURL}/api/v1/auth/reset-password/${token}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a> 
                <p>This link will expire in 24 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p style="font-family: Arial, sans-serif;">Best regards,</p> 
                <h1 style="color: #2c3e50; font-family: Arial, sans-serif;">The Sagar Library Team</h1>
  `,
  };

  verifyMailtransporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });

  return true;
};
