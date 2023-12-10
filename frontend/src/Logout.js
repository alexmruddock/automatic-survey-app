import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");

    // Navigate to the home route
    navigate('/');
  }, [navigate]);

  return (
    <div>Logging out...</div>
  );
};

export default Logout;
