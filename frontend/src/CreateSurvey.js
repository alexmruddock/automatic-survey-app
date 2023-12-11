import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authenticatedFetch from "./authenticatedFetch";
import BackButton from "./BackButton";
import SurveyForm from "./SurveyForm";
import SurveyDisplay from "./SurveyDisplay";
import { generateSurvey } from "./generateSurvey";
import { saveSurvey } from "./saveSurvey";

function CreateSurvey() {
  const [survey, setSurvey] = useState(null);
  const [segments, setSegments] = useState([]); // For storing available segments
  const [selectedSegments, setSelectedSegments] = useState([]); // For storing selected segment IDs
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch segments when the component mounts
    authenticatedFetch("https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/segments")
      .then(response => response.json())
      .then(data => setSegments(data))
      .catch(error => console.error("Error fetching segments:", error));
  }, []);

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

  const handleSegmentChange = (selected) => {
    setSelectedSegments(selected); // Update the state with selected segment IDs
  };

  const handleSave = async () => {
    try {
      // Include selectedSegments in the survey data
      const surveyDataWithSegments = { ...survey, segments: selectedSegments };
      const savedData = await saveSurvey(surveyDataWithSegments);
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
      <SelectSegments segments={segments} onSegmentChange={handleSegmentChange} />
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

// Component for segment selection
function SelectSegments({ segments, onSegmentChange }) {
  const handleSelectionChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onSegmentChange(selectedOptions);
  };

  return (
    <div>
      <label htmlFor="segments">Select Segments:</label>
      <select multiple id="segments" onChange={handleSelectionChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
        {segments.map(segment => (
          <option key={segment._id} value={segment._id}>{segment.name}</option>
        ))}
      </select>
    </div>
  );
}

export default CreateSurvey;
