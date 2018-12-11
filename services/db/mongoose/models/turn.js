const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  status: String,
  requestedTime: Date,
  expectedServiceTime: Date,
  branchId: mongoose.ObjectId,
  customerId: mongoose.ObjectId,
});

module.exports = mongoose.model('Turn', schema);