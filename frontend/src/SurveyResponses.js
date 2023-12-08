import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "./BackButton";
import authenticatedFetch from "./authenticatedFetch";
import jsPDF from "jspdf";

function SurveyResponses() {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [responses, setResponses] = useState([]);
  const { surveyId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Retrieve the stored token

    // Fetch the survey details
    fetch(
      `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/retrieve-survey/${surveyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSurveyTitle(data.title); // Set the survey title
      })
      .catch((error) => console.error("Error fetching survey details:", error));

    // Fetch the survey responses
    fetch(
      `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/survey-responses/${surveyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setResponses(data))
      .catch((error) => console.error("Error fetching responses:", error));
  }, [surveyId]);

  const handleAnalyzeResponses = async () => {
    try {
      const response = await authenticatedFetch(
        `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/analyze-responses/${surveyId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const { analysis } = await response.json();

        // Handle the analysis result, possibly download it as a file
        console.log(analysis);

        // Function to download analysis as a PDF
        const downloadAnalysis = (analysisText, surveyTitle) => {
          const doc = new jsPDF();

          // Use splitTextToSize to split the text into an array of strings
          const splitText = doc.splitTextToSize(analysisText, 180); // 180 is the max width in mm

          // Pass the array of strings to the text function
          doc.text(splitText, 10, 10); // This will wrap the text to the next line

          // Save the PDF with a dynamic name based on the survey title
          doc.save(`${surveyTitle}-analysis.pdf`);
        };
        downloadAnalysis(analysis, surveyTitle);
      } else {
        console.error("Failed to analyze responses");
      }
    } catch (error) {
      console.error("Error analyzing responses:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <BackButton />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Survey Responses
      </h2>
      <button
        onClick={handleAnalyzeResponses}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 transition duration-300"
      >
        Analyze Responses
      </button>
      {responses.length > 0 ? (
        <table className="min-w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Answers
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {responses.map((response) => (
              <tr key={response._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {response.userEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <ul className="list-disc pl-6">
                    {response.answers.map((answer, index) => (
                      <li key={index} className="text-gray-700">
                        <strong>{answer.question}</strong>: {answer.answer}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No responses yet</p>
      )}
    </div>
  );
}

export default SurveyResponses;
