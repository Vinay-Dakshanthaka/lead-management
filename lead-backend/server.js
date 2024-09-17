const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const db = require('./models');
const leadRoute = require('./routes/leadRoutes');
const authRoute = require('./routes/authRoutes');
const adminRoute = require('./routes/adminRoutes');
const counsellorRoute = require('./routes/counsellorRoutes');
// const counsellorRoute = require('./routes/counsellorRoutes');

const app = express();


const corsOptions = {
    // origin: 'https://www.laragrooming.com',
    origin: ['https://leads.paintpulse.in'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
// Enable CORS 
app.use(cors(corsOptions)); 

// app.use(cors({
//     origin: 'http://localhost:5173', // Client URL
//     credentials: true // Allow credentials (cookies) to be sent
// }));

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser

// Routes
app.use('/api/lead', leadRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/counsellor', counsellorRoute);

const PORT = 3003;

(async () => {
    try {
        await db.sequelize.sync({ force: false });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();
