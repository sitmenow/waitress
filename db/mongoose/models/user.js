const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  picture: String,
});

module.exports = mongoose.model('User', schema);
