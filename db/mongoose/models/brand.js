const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  picture: String,
});

module.exports = mongoose.model('Brand', schema);
