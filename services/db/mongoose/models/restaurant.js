const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.Model('Restaurant', schema);
