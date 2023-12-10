const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  criteria: {
    city: String,
    country: String,
    company: String,
    industry: String,
    interests: [String],
    products: [String],
    nps: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Timestamps can be helpful
}, { timestamps: true });

const Segment = mongoose.model('Segment', segmentSchema);
module.exports = Segment;
