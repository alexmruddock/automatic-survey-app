const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  criteria: [{
    key: String,
    operator: String,
    value: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Timestamps can be helpful
}, { timestamps: true });

const Segment = mongoose.model('Segment', segmentSchema);
module.exports = Segment;
