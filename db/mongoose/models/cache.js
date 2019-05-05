const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  expectedArrivalTime: {
    type: Date,
    expires: 10,
  },
  branchId: mongoose.Schema.ObjectId,
}, { _id: true, id: true });


module.exports = mongoose.model('Cache', schema);
