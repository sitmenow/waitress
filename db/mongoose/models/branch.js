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
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  picture: String,
});

module.exports = mongoose.model('Branch', schema);
