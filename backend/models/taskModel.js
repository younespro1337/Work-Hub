const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      default: 'pending',
    },
    worker: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    }],
    firstName: {
       type: String,
       required: true,
    },
    lastName: {
      type: String,
      required: true
    },
    expectation: {
      type: String,
    },
    deadlineDays: {
      type: String, 
      required: true,
    },
    assignmentType: {
      type: String,
      enum: ['group', 'individual'],
      default: 'individual',
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    images: [{
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      }
    }],
    videos: [{
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      }
    }],
    documents: [{
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
