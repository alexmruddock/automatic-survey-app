import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import SurveyForm from "./SurveyForm";
import SurveyDisplay from "./SurveyDisplay";
import { generateSurvey } from "./generateSurvey";
import { saveSurvey } from "./saveSurvey";

function CreateSurvey() {
  const [survey, setSurvey] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (surveyData) => {
    console.log("Received survey data: ", surveyData);
    const description = surveyData.description;
    try {
      const generatedSurvey = await generateSurvey(description);
      setSurvey(generatedSurvey);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSave = async () => {
    try {
      const savedData = await saveSurvey(survey);
      console.log("Saved Survey: ", savedData);

      // provide user feedback and redirect 
      alert("Survey saved successfully!");
      navigate('/');
    } catch (error) {
      console.error(error.message);
      alert("Error saving survey!");
    }
  };

  return (
    <div>
      <BackButton />
      <SurveyForm onSubmit={handleGenerate} />
      <div className="h-8"></div>
      <SurveyDisplay survey={survey} />
      {survey && (
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Survey
        </button>
      )}
    </div>
  );
}

export default CreateSurvey;
