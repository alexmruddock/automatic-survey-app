import React from "react";
import "./index.css";

function SurveyDisplay({ survey }) {
  if (!survey || !survey.questions || survey.questions.length === 0) {
    return (
      <p className="text-gray-600 text-center my-4">
        No survey questions to display.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {survey.title}
      </h2>
      <p className="text-gray-600 mb-4">{survey.description}</p>
      {survey.questions.map((question, index) =>
        renderQuestion(question, index)
      )}
    </div>
  );
}

function renderQuestion(question, index) {
  switch (question.question_type) {
    case "multiple_choice":
      return (
        <div key={index} className="mb-4">
          <p className="font-medium text-gray-700">{question.question}</p>
          <div className="flex flex-col mt-2">
            {question.options.map((option) => (
              <label key={option} className="inline-flex items-center mt-1">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  className="form-radio"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "rating":
    case "rating_scale": // Combining as they are similar
      return (
        <div key={index} className="mb-4">
          <p className="font-medium text-gray-700">{question.question}</p>
          <div className="flex justify-between">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
          <input type="range" min="0" max="10" className="mt-2 w-full" />
        </div>
      );

    case "open_ended":
    case "open_text":
    case "text": // Combining as they are similar
      return (
        <div key={index} className="mb-4">
          <p className="font-medium text-gray-700">{question.question}</p>
          <textarea
            name={`question-${index}`}
            className="mt-2 w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>
      );

    default:
      return (
        <p key={index} className="text-red-500">
          Unsupported question type: {question.type}
        </p>
      );
  }
}

export default SurveyDisplay;
