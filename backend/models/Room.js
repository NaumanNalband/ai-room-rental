const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  type:        { type: String, enum: ['1BHK','2BHK','3BHK','PG','Studio'], required: true },
  amenities:   [String],
  images:      [String],
  city:        { type: String, required: true },
  address:     { type: String, required: true },
  lat:         { type: Number },
  lng:         { type: Number },
  broker:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);