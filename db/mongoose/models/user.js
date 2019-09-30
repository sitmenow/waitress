const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  _id: { type: String, required: true, auto: false },
  name: String,
  email: String,
  picture: String,
}, { _id: false });

module.exports = mongoose.model('User', schema);
