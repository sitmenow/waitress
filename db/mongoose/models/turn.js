const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  status: String,
  requestedTime: Date,
  updatedTime: Date,
  // servedTime    -> logger
  // rejectedTime  -> logger
  expectedServiceTime: Date,
  branchId: mongoose.ObjectId,
  customerId: mongoose.ObjectId,
  metadata: Object, // { guests, plates, email_address, etc }
});

module.exports = mongoose.model('Turn', schema);
