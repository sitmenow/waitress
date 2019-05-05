const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: String,
  address: String,
  lastOpeningTime: Date,
  lastClosingTime: Date,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  brandId: mongoose.ObjectId,
});

module.exports = mongoose.model('Branch', schema);
