const nodemailer = require("nodemailer");
//sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({ to, from, subject, text }) => {
  const details = { to, from, subject, text };
  let mailTransporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "Gigday.223@outlook.com",
      pass: "@gig12345",
    },
  });

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("sent");
    }
  });
};

module.exports = sendEmail;
