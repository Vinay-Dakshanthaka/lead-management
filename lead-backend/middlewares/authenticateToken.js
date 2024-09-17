const jwt = require('jsonwebtoken');
const db = require('../models');

// const Counsellor = db.Counsellor;
const secretKey = process.env.JWT_SECRET; // Use the secret from the environment

// Middleware to authenticate JWT and set req.counsellor
const authenticateToken = async (req, res, next) => {
     // Step 1: Check presence of token
     const authHeader = req.headers.authorization;
     if (!authHeader) {
         return res.status(401).json({ message: 'No token provided.' });
     }
 
     // Step 2: Check JWT token format
     const tokenParts = authHeader.split(' ');
     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
         return res.status(401).json({ message: 'Invalid token format.' });
     }
 
     const token = tokenParts[1];
 
     // Step 3: Verify the token
     jwt.verify(token, secretKey, (err, decoded) => {
         // console.log("Token: ", token);
         // console.log("Error: ", err);
         // console.log("Decoded: ", decoded);
         if (err) {
             return res.status(401).json({ message: 'Failed to authenticate token.' });
         }
 
         // Attach the counsellor ID to the request object
         req.counsellor_id = decoded.counsellor_id;
         // console.log("Token extracted ID: ", req.student_id);
         // Proceed to the next middleware
         next();
     });
};

module.exports = authenticateToken;
