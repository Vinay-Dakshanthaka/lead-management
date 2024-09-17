const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // You can use other services like SendGrid, SES, etc.
//     auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS  // Your email password or app password
//     }
// });

let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // or 465 for secure connection
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const secretKey =  process.env.JWT_SECRET;

// Send email function
const sendWelcomeEmail = async (email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // sender address
        to: email, // receiver's email
        subject: 'Account Created Successfully',
        text: `Welcome to our platform! Your account has been created. Use the following credentials to log in:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
        html: `<h3>Welcome to our platform!</h3>
               <p>Your account has been created. Use the following credentials to log in:</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Password:</strong> ${password}</p>
               <p>Please change your password after logging in.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

const sendResetPassowordEmail = async (email, password) => {
  const token = jwt.sign({ counsellor_id: user.counsellor_id }, secretKey, { expiresIn: '30m' }); 

    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // sender address
        to: email, // receiver's email
        subject: 'Password Reset Request', // Subject line
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset the password associated with your account.</p>
                <p>To proceed with the password reset, please click on the button below:</p>
                <a href="${baseURL}/api/auth/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, you can ignore this email.</p>
                <p>Please note that the link will expire after 30 minutes, so make sure to reset your password promptly.</p>
                <p>Thank You,</p>
                <p>Lead Management</p>
            </div>
        `
    };
    console.log(`${baseURL}api/auth/reset-password?token=${token}`)

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = { sendWelcomeEmail };
