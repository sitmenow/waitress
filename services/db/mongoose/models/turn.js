const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  status: String,
  requested_time: Date,
  expected_service_time: Date,
  restaurantId: mongoose.ObjectId,
  customerId: mongoose.ObjectId,
});

module.exports = mongoose.model('Turn', schema);
