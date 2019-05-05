const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  name: String,
  status: String,
  requestedTime: Date,
  updatedTime: Date,
  expectedServiceTime: Date,
  branchId: mongoose.ObjectId,
  customerId: mongoose.ObjectId,
  metadata: Object,
  expirationTime: {
    type: Date,
    expires: 10800, // 3 hours
  },
}, { _id: true, id: true });

module.exports = mongoose.model('TurnCache', schema);
