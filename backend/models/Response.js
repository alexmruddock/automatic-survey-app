const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  surveyId: mongoose.Schema.Types.ObjectId,
  answers: [{
    question: String,
    answer: String
  }],
  userEmail: { // Add a field to store the user's email
    type: String,
    required: true // Make it required if you always want to store this information
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);