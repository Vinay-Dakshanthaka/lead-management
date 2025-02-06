const nodemailer  = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: "mail.totfd.fun", // Replace with your Mailcow SMTP server
    port: 587, // STARTTLS port
    secure: false, // false for STARTTLS (only true for port 465)
    auth: {
      user: "info@totfd.fun",
      pass: "Vinay@4499"
    },
    tls: {
        rejectUnauthorized: false // (Optional) Use if you have SSL certificate issues
    }
});


let mailOptions = {
    from: '"Your Name" @totfd.fun>', // Your Mailcow email
    to: "recipient@example.com", // Receiver's email
    subject: "Test Email from Mailcow",
    text: "This is a test email from Mailcow SMTP using Nodemailer.",
    html: "<b>This is a test email from Mailcow SMTP using Nodemailer.</b>"
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Error: ", error);
    } else {
        console.log("Email sent: " + info.response);
    }
});
