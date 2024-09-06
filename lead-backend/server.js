const express = require('express');
const cors = require('cors');
// const session = require('express-session')

const bodyParser = require('body-parser');
const db = require('./models');
const leadRotue = require('./routes/leadRoutes')

const app = express();

// app.use(session({
//     secret: 'myverysecureandlongrandomsecretkey123', // Use your generated secret key here
//     resave: false,
//     saveUninitialized: true
// }));


app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your client URL
//     credentials: true // Allow credentials (cookies) to be sent
// }));
app.use(bodyParser.json());

app.use('/api/lead', leadRotue);


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
