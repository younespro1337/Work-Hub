const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');

const app = express();

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


