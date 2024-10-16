const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const rateLimit = require('express-rate-limit');


const app = express();

// Rate Limiting
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});


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


