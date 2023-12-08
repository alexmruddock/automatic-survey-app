// SurveysList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SurveysList({ userRole }) {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  // Fetch all surveys on component mount
  useEffect(() => {
    if (userRole) {
      fetch(
        "https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/get-surveys"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setSurveys(data))
        .catch((error) => console.error("Error fetching surveys:", error));
    }
  }, [userRole]);

  // Function to copy the survey link to the clipboard
  function copyToClipboard(surveyId) {
    const url = `${window.location.origin}/survey/${surveyId}`; // Construct the survey URL
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(`Copied link to clipboard: ${url}`); // Notify the user (consider a better notification system)
      })
      .catch((err) => console.error("Error copying link:", err));
  }

  // Function to delete a survey
  function deleteSurvey(surveyId) {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      console.log("Deleting survey:", surveyId);

      const token = localStorage.getItem("accessToken");

      fetch(
        `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/delete-survey/${surveyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(() => {
          setSurveys(surveys.filter((survey) => survey._id !== surveyId)); // Update state to reflect deletion
          alert("Survey deleted successfully");
        })
        .catch((error) => console.error("Error deleting survey:", error));
    }
  }

  // Function to view responses for a survey
  function viewResponses(surveyId) {
    console.log("Viewing responses for survey:", surveyId);
    navigate(`/survey-responses/${surveyId}`);
  }

  if (!userRole) return <p>Please log in to view surveys.</p>;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Surveys</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey._id} className="bg-white border-b">
                <td className="px-4 py-2">{survey.title}</td>
                <td className="px-4 py-2 flex justify-around items-center">
                  <Link
                    to={`/survey/${survey._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    View Survey
                  </Link>
                  {userRole === "admin" && (
                    <>
                      <button
                        onClick={() => copyToClipboard(survey._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mx-2"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => viewResponses(survey._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mx-2"
                      >
                        View Responses
                      </button>
                      <button
                        onClick={() => deleteSurvey(survey._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SurveysList;
