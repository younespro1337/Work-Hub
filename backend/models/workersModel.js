const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { StringDecoder } = require('string_decoder');


const WorkersSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
 
  position: {
    type:String,
    required: true,
    default: "unknown",
  },
  salary: {
   type: Number,
   required: true,
   default: 0,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
    default:'other',
  },
  nationalId: {
    type: String,
    required: false,
    unique: true
},
  phoneNumber: {
    type: String,
    required: true,
    default:'+212 0000'
  },
  role: {
    type: String,
    enum: ['user', 'admin','unknown'],
    default: 'unknown',
  },
  legalInfo: {
    type: String,
    required:false,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
      default:'N/A'
    },
    url: {
      type: String,
      required:false,
      default:'https://cdnassets.hw.net/eb/31/777a1d784ee2a38d9a739146266d/adobestock-262235652-web.jpg'
    },
  },
  chats: [
    {
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
      type: {
        type: String,
        enum: ['private', 'group'],
        required: true,
      },
    },
  ],
  registerAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  receiveUpdates: {
    type: Boolean,
    default: true,
  },
});


WorkersSchema.methods.generateToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};


WorkersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});


WorkersSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


WorkersSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



WorkersSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


const Workers = mongoose.model('users', WorkersSchema);

module.exports = Workers;

