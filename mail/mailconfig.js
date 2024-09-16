import nodemailer from "nodemailer";
const { VERIFYMAILUSER, VERIFYMAILPASSWORD } = process.env;

export const verifyMailtransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: String(VERIFYMAILUSER),
    pass: String(VERIFYMAILPASSWORD),
  },
});
