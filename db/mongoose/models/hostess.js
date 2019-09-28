const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  branchId: mongoose.ObjectId,
  userId: String,
});

module.exports = mongoose.model('Hostess', schema);
