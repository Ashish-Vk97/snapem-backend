const nodemailer = require("nodemailer");

module.exports = {
  sendMail: async (options) => {

    console.log(options,"==========>options")
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SENDER_USER,
        pass: process.env.BREVO_SENDER_PASSWORD,
      },
    });
    const message = {
      from: process.env.BREVO_SENDER_EMAIL,
      to: options["to"],
      // ccBcc: options["ccBcc"],
      // cc: options["ccBcc"] && options["ccBcc"].cc ? options["ccBcc"].cc : [],
      // bcc: options["ccBcc"] && options["ccBcc"].bcc ? options["ccBcc"].bcc : [],
      subject: options["subject"],
      html: options["html"],
    };
    console.log(message,"==========>msg")
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Message sent: %s", info.messageId);
      }
    });
  },
}