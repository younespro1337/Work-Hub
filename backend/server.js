const app = require('./app');
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const { Server } = require('socket.io');
const httpServer = http.createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGING || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

const PORT = process.env.PORT || 5000;




io.on('connection', (socket) => {

socket.on('message', (data) => {
// console.log('Received message:', data);
io.emit('message', data);

})

socket.on('materialRequest', async (userId) => {
  // console.log(`User ${userId} joined with socket ID: ${socket.id}`);
});


// dle 'disconnect' event
socket.on('disconnect', () => {
// console.log('User disconnected');
});
})



module.exports = io ;


process.on('uncaughtException', (err) => {
  // console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Connect to the database
connectDatabase();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Start the Express app


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));






