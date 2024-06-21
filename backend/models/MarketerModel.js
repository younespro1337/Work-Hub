const mongoose = require('mongoose');

const marketerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  experience: String,
  portfolio: String,
  b2bExpertise: String,
  additionalQuestion: String
});

const MarketerModel = mongoose.model('Marketer', marketerSchema);

module.exports = MarketerModel;
