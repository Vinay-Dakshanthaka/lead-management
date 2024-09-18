const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { sendWelcomeEmail } = require('../services/emailService');
const { baseURL } = require('./baseUrlConfig');

const Counsellor = db.Counsellor;
const saltRounds = 10;

// const secretKey = 'yourSecretKey'; // Use environment variables in a production environment
const secretKey =  process.env.JWT_SECRET;

const signUp = async (req, res) => {
    try {
        // const userId = req.counsellor_id;
        // const user = await Counsellor.findByPk(userId);
        
        // if (!user) {
        //     return res.status(404).send({ message: "No user found" });
        // }

        // const role = user.role;

        // // Check if the role is COUNSELLOR
        // if (role !== 'ADMIN') {
        //     return res.status(403).send({ message: "Access denied. Insufficient permissions." });
        // }

        const { email, phone, password, is_active = true } = req.body;

        // Check if a counsellor already exists with the provided email or phone
        const existingCounsellor = await Counsellor.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });
        if (existingCounsellor) {
            return res.status(409).send({ message: "Counsellor with this email or phone number already exists" });
        }

        // Keep original password for email
        const plainPassword = password;

        // Hash the password with 10 salt rounds for storage in DB
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Create a new counsellor with the hashed password
        const newCounsellor = await Counsellor.create({
            email,
            phone,
            password: hashedPassword,
            is_active,
        });

        // Send welcome email with plain password
        await sendWelcomeEmail(email, plainPassword); // Using plainPassword here

        return res.status(201).send({ message: "Account Created successfully", counsellor: newCounsellor });

    } catch (error) {
        console.error("Error creating counsellor:", error);
        return res.status(500).send({ message: "Failed to create Account", error });
    }
};

const signUpWithDummyPassword = async (req, res) => {
    try {
        const userId = req.counsellor_id;
        const user = await Counsellor.findByPk(userId);
        
        if (!user) {
            return res.status(404).send({ message: "No user found" });
        }

        const role = user.role;

        // Check if the role is ADMIN
        if (role !== 'ADMIN') {
            return res.status(403).send({ message: "Access denied. Insufficient permissions." });
        }

        const { email, phone, is_active = true } = req.body;

        // Check if a counsellor already exists with the provided email or phone
        const existingCounsellor = await Counsellor.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });
        if (existingCounsellor) {
            return res.status(409).send({ message: "Counsellor with this email or phone number already exists" });
        }

        // Use a dummy password for every new counsellor
        const plainPassword = "Counsellor@123";

        // Hash the dummy password with 10 salt rounds for storage in DB
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Create a new counsellor with the hashed password
        const newCounsellor = await Counsellor.create({
            email,
            phone,
            password: hashedPassword,
            is_active,
        });

        // Send welcome email with the dummy password
        await sendWelcomeEmail(email, plainPassword); // Sending the dummy password via email

        return res.status(201).send({ message: "Account Created successfully", counsellor: newCounsellor });

    } catch (error) {
        console.error("Error creating counsellor:", error);
        return res.status(500).send({ message: "Failed to create Account", error });
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the counsellor by email
        const counsellor = await Counsellor.findOne({ where: { email } });
        if (!counsellor) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, counsellor.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // Generate a JWT token with counsellor_id, expiring in 7 days
        const token = jwt.sign({ counsellor_id: counsellor.counsellor_id }, secretKey, {
            expiresIn: '7d', // 7 days expiration
        });

        // Set the token in an HTTP-only cookie for security
        // res.cookie('token', token, {
        //     httpOnly: true, // Prevents JavaScript access
        //     secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // });

        // Send role in response (if needed)
        return res.status(200).send({ message: "Sign-in successful", role: counsellor.role, token, password_updated:counsellor.password_updated });

    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).send({ message: "Failed to sign in", error });
    }
};


// const signOut = (req, res) => {
//     res.clearCookie('token', {
//         httpOnly: true,
//         secure: req.hostname !== 'localhost', // Secure only in production (not localhost)
//         sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Strict in production, lax for development
//     });

//     return res.status(200).send({ message: "Sign-out successful" });
// };

let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // or 465 for secure connection
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if the email exists in the database
        const user = await Counsellor.findOne({ where: { email } });
        if (!user) {
            return res.status(403).send({ message: 'No account exists with this email ID.' });
        }

        // Generate unique token using JWT
        const token = jwt.sign({ counsellor_id: user.counsellor_id }, secretKey, { expiresIn: '30m' }); 

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // Sender address
            to: email, // Recipient's email address
            subject: 'Password Reset Request', // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset the password associated with your account.</p>
                    <p>To proceed with the password reset, please click on the button below:</p>
                    <a href="${baseURL}/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request a password reset, you can ignore this email.</p>
                    <p>Please note that the link will expire after 30 minutes, so make sure to reset your password promptly.</p>
                    <p>Thank You,</p>
                    <p>Lead Management</p>
                </div>
            `
        };
        console.log(`${baseURL}/reset-password?token=${token}`)
        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);

        return res.status(200).send({ success: true, message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).send({ success: false, message: 'An error occurred while sending the password reset email.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.query.token; // Get the token from the query parameters which is sent along with the email link

        if (!token) {
            return res.status(400).send({ message: 'Token is missing.' });
        }

        // Verify the JWT token
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
              console.error('Error verifying token:', err);
              console.log('Token:', token);
              console.log('jwtSecret:', secretKey);
              return res.status(403).send({ message: 'Invalid or expired token.' });
            }
          
            console.log('Decoded token:', decoded);
          
            if (!decoded || !decoded.counsellor_id) {
              console.error('Decoded token is invalid or missing counsellor_id');
              return res.status(403).send({ message: 'Invalid token.' });
            }
          
            const counsellorId = decoded.counsellor_id;
            req.counsellor_id = counsellorId;
          
            // Retrieve user information from the database
            try {
              const user = await Counsellor.findOne({ where: { counsellor_id: counsellorId } });
              console.log('user:', user);
              if (!user) {
                return res.status(404).send({ message: 'User not found.' });
              }
          
              // Hash the new password
              const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
          
              // Update the password in the database
              await Counsellor.update({ password: hashedPassword }, { where: { counsellor_id: counsellorId } });
          
              return res.status(200).send({ message: 'Password updated successfully.' });
            } catch (error) {
              console.error('Error finding user:', error);
              return res.status(500).send({ message: 'An error occurred while resetting the password.' });
            }
          });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).send({ message: 'An error occurred while resetting the password.' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.counsellor_id; // Get the counsellor_id from the request
        const { originalPassword, newPassword } = req.body; // Extract original and new password from the request

        // Fetch the user based on the provided counsellor_id
        const user = await Counsellor.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the original password matches the stored password
        const passwordMatch = await bcrypt.compare(originalPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Original password is incorrect" });
        }

        // Check if the original password is 'Counsellor@123'
        if (originalPassword === "Counsellor@123" && newPassword === "Counsellor@123") {
            return res.status(403).send({ message: "Cannot change to 'Counsellor@123'. Please set a stronger password." });
        }

        // Ensure the new password is not the dummy password
        if (newPassword === "Counsellor@123") {
            return res.status(400).send({ message: "Cannot use 'Counsellor@123' as the new password. Please choose a different password." });
        }

        // Ensure the new password is different from the original password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send({ message: "New password cannot be the same as the original password" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password and set password_updated to true
        user.password = hashedPassword;
        user.password_updated = true; // Mark password as updated
        await user.save();

        return res.status(200).send({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).send({ message: "Failed to update password", error });
    }
};



module.exports = {
    signUp,
    signUpWithDummyPassword,
    signIn,
    // signOut,
    sendPasswordResetEmail,
    resetPassword,
    updatePassword,
}