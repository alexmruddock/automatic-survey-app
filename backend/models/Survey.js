const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [{
    question_type: String,
    question: String,
    options: [String],
    scale: Number
  }],
  segments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  }],
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;