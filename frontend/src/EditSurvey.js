import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditSurveyQuestion from "./EditSurveyQuestion";
import authenticatedFetch from "./authenticatedFetch"; // Assuming you have this utility for authenticated requests

function EditSurvey() {
  const { surveyId } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const navigate = useNavigate();

  // get survey by id
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await authenticatedFetch(
          `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/retrieve-survey/${surveyId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSurveyData(data);
        } else {
          console.error("Failed to fetch survey data.");
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  // update survey question
  const handleQuestionChange = (index, newText) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[index].question = newText;
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  // update survey option
  const handleOptionChange = (questionIndex, optionIndex, newOptionText) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = newOptionText;
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  // add survey option
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[questionIndex].options.push("");
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  // remove survey option
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  // update survey
  const handleSurveySubmit = async () => {
    try {
      const response = await authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/update-survey/${surveyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        }
      );
      if (response.ok) {
        alert("Survey updated successfully.");
        navigate("/surveys");
      } else {
        alert("Failed to update survey.");
      }
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Error updating survey.");
    }
  };

  if (!surveyData) {
    return <p>Loading survey data...</p>;
  }

  return (
    <div className="space-y-6 px-4 py-5 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Survey</h2>
  
      <div className="space-y-4">
        <div>
          <label htmlFor="surveyTitle" className="block text-sm font-medium text-gray-700">
            Survey Title
          </label>
          <input
            id="surveyTitle"
            type="text"
            value={surveyData.title}
            onChange={(e) => setSurveyData({ ...surveyData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
  
        <div>
          <label htmlFor="surveyDescription" className="block text-sm font-medium text-gray-700">
            Survey Description
          </label>
          <textarea
            id="surveyDescription"
            value={surveyData.description}
            onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
          />
        </div>
      </div>
  
      <div className="space-y-4">
        {surveyData.questions.map((question, index) => (
          <EditSurveyQuestion
            key={index}
            question={question}
            index={index}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
          />
        ))}
      </div>
  
      <button
        onClick={handleSurveySubmit}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        Submit Changes
      </button>
    </div>
  );  
}

export default EditSurvey;
