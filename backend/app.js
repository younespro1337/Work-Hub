const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const rateLimit = require('express-rate-limit');


const app = express();

app.set('trust proxy', 2);

// Rate Limiting
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(defaultLimiter);

// config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../config.env' }); 
}


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const material = require('./routes/productRoute');
const user = require('./routes/userRoute');
app.use('/api/v1', user);
app.use('/api/v1', material);
app.use(defaultLimiter)

 // deployment
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'build' directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve the 'index.html' file for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
  });
}

// error middleware
app.use(errorMiddleware);
module.exports = app;


