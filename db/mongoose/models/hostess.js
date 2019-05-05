const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  branchId: mongoose.ObjectId,
});

module.exports = mongoose.model('Hostess', schema);
