import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import CreateSurvey from "./CreateSurvey";
import SurveyDisplayById from "./SurveyDisplayById";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import SurveyResponses from "./SurveyResponses";
//import LocalStorageDisplay from "./LocalStorageDisplay";
import authenticatedFetch from "./authenticatedFetch";
import UserManagement from "./UserManagement";
import SurveysList from "./SurveysList";
import "./index.css";

function App() {
  const [userRole, setUserRole] = useState(null); // Initialize user role to null
  const [userEmail, setUserEmail] = useState(null); // Initialize user email to null
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize isLoggedIn to false

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      // Check if accessToken exists in localStorage
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // Attempt to fetch user details
          const response = await authenticatedFetch(
            "https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/fetch-user"
          );
          if (response.ok) {
            // User is logged in
            const userData = await response.json();
            setUserRole(userData.role);
            setUserEmail(userData.email);
            setIsLoggedIn(true);
          } else {
            // User is not logged in
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking authentication status:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthenticationStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.reload(); // Refresh the page to update the UI
  };

  function setUserDetails(email, role) {
    setUserEmail(email);
    setUserRole(role);
  }

  return (
    <Router>
      {isLoggedIn !== null && (
      <Header
        userRole={userRole}
        userEmail={userEmail}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
    )}
      <div className="App bg-gray-100 min-h-screen flex flex-col items-center pt-8">
        <Routes>
          <Route path="/" element={<Home userRole={userRole} />} />
          <Route
            path="/login"
            element={<LoginForm setUserDetails={setUserDetails} />}
          />
          <Route
            path="/register"
            element={<RegistrationForm setUserDetails={setUserDetails} />}
          />
          <>
            <Route
              path="/surveys"
              element={<SurveysList userRole={userRole} />}
            />
            <Route
              path="/users"
              element={<UserManagement userRole={userRole} />}
            />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/survey/:surveyId" element={<SurveyDisplayById />} />
            <Route
              path="/survey-responses/:surveyId"
              element={<SurveyResponses />}
            />
          </>
          {/* ... other routes ... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
