const nodemailer = require('nodemailer');
// const SMTPTransport = require('nodemailer/lib/smtp-transport');

const emailSender = async (to, subject, html) => {
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f39ae1e4f58dad",
        pass: "ab1a3fa7143df2"
      }
  });

  let info = await transport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: values.inputs.email,
    subject: "OTP generate ✔",
    text: "Hello world?",
    html: `<b>Hello world? Here is your otp: :
    ${otp}
     </b>`,
  });

  return success(res, "Otp Sent Successfully");

};