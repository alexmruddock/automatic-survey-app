import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import CreateSurvey from "./CreateSurvey";
import EditSurvey from "./EditSurvey";
import SurveyDisplayById from "./SurveyDisplayById";
import LoginForm from "./LoginForm";
import Logout from "./Logout";
import RegistrationForm from "./RegistrationForm";
import SurveyResponses from "./SurveyResponses";
import SurveyVisualizations from "./SurveyVisualizations"; // Import the new component
//import LocalStorageDisplay from "./LocalStorageDisplay";
import authenticatedFetch from "./authenticatedFetch";
import UserManagement from "./UserManagement";
import SurveysList from "./SurveysList";
import SegmentManager from "./SegmentManager";
import EditSegment from "./EditSegment";
import SegmentUsers from "./SegmentUsers";
import "./index.css";
import FilteredSurveysList from "./FilteredSurveysList";

function App() {
  const [userRole, setUserRole] = useState(null); // Initialize user role to null
  const [userEmail, setUserEmail] = useState(null); // Initialize user email to null
  const [userId, setUserId] = useState(null); // Initialize user ID to null
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize isLoggedIn to false

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
            setUserRole(userData.role);
            setUserEmail(userData.email);
            setUserId(userData.userId);
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
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/register"
            element={<RegistrationForm setUserDetails={setUserDetails} />}
          />
          <>
            <Route
              path="/surveys"
              element={
                userRole === "admin" ? (
                  <SurveysList userRole={userRole} />
                ) : (
                  <FilteredSurveysList userRole={userRole} userId={userId} />
                )
              }
            />
            <Route
              path="/users"
              element={<UserManagement userRole={userRole} />}
            />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/survey/:surveyId" element={<SurveyDisplayById />} />
            <Route path="/edit-survey/:surveyId" element={<EditSurvey />} />
            <Route
              path="/survey-responses/:surveyId"
              element={<SurveyResponses />}
            />
            <Route
              path="/survey-visualizations/:surveyId"
              element={<SurveyVisualizations />}
            />
            <Route path="/manage-segments" element={<SegmentManager />} />
            <Route path="/edit-segment/:segmentId" element={<EditSegment />} />
            <Route
              path="/segment-users/:segmentId"
              element={<SegmentUsers />}
            />
          </>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
