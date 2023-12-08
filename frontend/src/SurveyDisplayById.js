import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "./index.css";

function SurveyDisplayById() {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const { surveyId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");
  const surveyCountKey = `surveyCount_${surveyId}_${userEmail}`;

  // Retrieve the submission count from local storage
  const [submissionCount, setSubmissionCount] = useState(
    parseInt(localStorage.getItem(surveyCountKey)) || 0 // If the key doesn't exist, default to 0
  );

  useEffect(() => {
    fetch(
      `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/retrieve-survey/${surveyId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSurvey(data))
      .catch((error) => console.error("Error fetching survey:", error));
  }, [surveyId]);

  function handleResponseChange(questionIndex, value) {
    setResponses({ ...responses, [questionIndex]: value });
  }

  function handleSubmit() {
    const answers = Object.entries(responses).map(([questionIndex, answer]) => {
      return { question: survey.questions[questionIndex].question, answer };
    });

    submitSurvey(surveyId, answers)
      .then(() => {
        setResponses({}); // Clear responses
        setIsSubmitted(true); // Set isSubmitted to true

        // update submission count
        const newCount = submissionCount + 1; // Increment the submission count
        setSubmissionCount(newCount); // Update the state
        localStorage.setItem(surveyCountKey, newCount.toString()); // Update local storage

        setTimeout(() => {
          navigate("/");
        }, 3000);
        alert("Survey submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting survey:", error);
        alert("Error submitting survey");
      });
  }

  // Include the renderQuestion function from SurveyDisplay or make it a shared utility
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
                    onChange={(e) =>
                      handleResponseChange(index, e.target.value)
                    }
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "rating":
      case "rating_scale":
        return (
          <div key={index} className="mb-4">
            <p className="font-medium text-gray-700">{question.question}</p>
            <div className="flex justify-between">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              className="mt-2 w-full"
              onChange={(e) => handleResponseChange(index, e.target.value)}
            />
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
              onChange={(e) => handleResponseChange(index, e.target.value)}
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

  if (!survey) {
    return <p className="text-gray-600 text-center my-4">Loading survey...</p>;
  }

  // Reuse the render logic from SurveyDisplay
  if (isSubmitted) {
    return (
      <div className="thank-you-message">
        <p>Thank you for completing the survey!</p>
        <p>Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <BackButton />
      <h2 className="text-3xl font-semibold text-gray-800 my-4">
        {survey.title}
      </h2>
      <span className="text-sm text-gray-600">
        Times Completed: {submissionCount}
      </span>
      <p className="text-gray-700 text-lg my-4">{survey.description}</p>

      {survey.questions.map((question, index) =>
        renderQuestion(question, index)
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
      >
        Submit Survey
      </button>
    </div>
  );
}

async function submitSurvey(surveyId, answers) {
  const userEmail = localStorage.getItem("userEmail"); // Retrieve the user's email from local storage

  const response = await fetch(
    "https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/submit-response",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyId, answers, userEmail }), // Include userEmail in the request body
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error submitting survey response: " + (await response.text())
    );
  }

  return response.json();
}

export default SurveyDisplayById;
