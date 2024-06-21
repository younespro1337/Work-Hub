const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  geolocation: [{
    type: Object, // Assuming the geolocation data is stored as an object
    required: false, // Adjust as per your requirements
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },

});

const EmailLog = mongoose.model('EmailLog', emailSchema);

module.exports = EmailLog;
