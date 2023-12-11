import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authenticatedFetch from './authenticatedFetch';

function FilteredSurveysList({ userRole, userId }) {
  const [surveys, setSurveys] = useState([]);

  // Fetch surveys relevant to the user or all surveys if the user is an admin
  useEffect(() => {
    const fetchSurveys = async () => {
      const url = userRole === 'admin' 
        ? 'https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/get-surveys'
        : `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/surveys-for-user/${userId}`;

      const response = await authenticatedFetch(url);
      const data = await response.json();
      setSurveys(data);
    };

    fetchSurveys();
  }, [userRole, userId]);

  if(!Array.isArray(surveys)) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Filtered Surveys</h2>
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
                      {/* Add additional buttons for admin actions like Copy Link, View Responses, Delete */}
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

export default FilteredSurveysList;
