import React from 'react';
import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
import authenticatedFetch from './authenticatedFetch';
import SurveyCards from './SurveyCards';

function Home({ userRole }) {
  const [surveys, setSurveys] = useState([]);
  const [userId, setUserId] = useState('');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      // Check if accessToken exists in localStorage
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // Attempt to fetch user details
          const response = await authenticatedFetch(
            "https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/fetch-user"
          );
          if (response.ok) {
            // User is logged in
            const userData = await response.json();
            //setUserRole(userData.role);
            //setUserEmail(userData.email);
            setUserId(userData.userId);
            //setIsLoggedIn(true);
          } else {
            // User is not logged in
            //setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking authentication status:", error);
        }
      } else {
        //setIsLoggedIn(false);
      }
    };

    checkAuthenticationStatus();
  }, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      let url;
  
      if (userRole === 'admin') {
        url = 'https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/get-surveys';
      } else if (userId) {
        // Only proceed if userId is available for non-admin users
        url = `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/surveys-for-user/${userId}`;
      } else {
        // Exit function if userId is not available for non-admin users
        return;
      }
  
      try {
        const response = await authenticatedFetch(url);
        if (response.ok) {
          const data = await response.json();
          setSurveys(data);
        } else {
          // Handle errors
          console.error('Error fetching surveys');
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };
  
    fetchSurveys();
  }, [userRole, userId]); // Dependency array ensures effect runs when userRole or userId changes
  

  if(!Array.isArray(surveys)) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <nav className="mb-4">
        {isLoggedIn ? (
          <>
            {userRole === 'admin' && (
              <Link 
                to="/create" 
                className="ml-4 mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Survey
              </Link>
            )}
            <SurveyCards surveys={surveys} />
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="ml-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </Link>
          </>
        )}
      </nav>
      
    </div>
  );
}

export default Home;
