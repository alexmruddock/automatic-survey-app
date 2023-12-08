import React from 'react';
import { Link } from 'react-router-dom';
// import SurveysList from './SurveysList';

function Home({ userRole }) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  /*
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    window.location.reload(); // Refresh the page to update the UI
  };
  */

  return (
    <div>
      <nav className="mb-4">
        {isLoggedIn ? (
          <>
            {userRole === 'admin' && (
              <Link 
                to="/create" 
                className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Survey
              </Link>
            )}
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
