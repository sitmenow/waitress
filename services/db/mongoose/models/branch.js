const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  restaurantid: mongoose.ObjectId,
});

module.exports = mongoose.model('Branch', schema);
