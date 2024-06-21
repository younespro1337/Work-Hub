const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workers',
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workers',
      },
      content: {
        type: {
          type: String,
          enum: ['text', 'media', 'document'],
          required: true,
        },
        data: String,
        media: {      
          fileUrl: String,
          asset_id: String,
          format: String,
          height: Number,
          width: Number,
          original_filename: String,
          secure_url: String,
        },
        avatars: {
          senderAvatar:{
            type: String,
            required: false,
          },

          otherAvatar: {
            type: String,
            required: false,
          } 
        },
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
