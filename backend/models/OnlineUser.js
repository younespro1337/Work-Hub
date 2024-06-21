// models/OnlineUser.js

const mongoose = require('mongoose');

const onlineUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
ref:'users'
  },
  socketId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum:['online', 'offline'],
    default: 'offline',
    required:true
  }
});

const OnlineUser = mongoose.model('OnlineUser', onlineUserSchema);

module.exports = OnlineUser;
