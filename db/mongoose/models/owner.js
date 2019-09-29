const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  userId: String,
});

module.exports = mongoose.model('Owner', schema);
