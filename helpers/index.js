const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,// true for 465, false for other ports
    secure: false,
    requireTLS: true,
    auth: {
      user: "tejpratapp@gmail.com",
      pass: "mhrvkvghycsnjdtf"
    }
  });
  // create reusable transporter object using the default SMTP transport
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};
