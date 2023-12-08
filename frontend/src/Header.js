import React from "react";
import { Link } from "react-router-dom";

function Header({ userRole, userEmail, handleLogout}) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/surveys" className="hover:text-gray-300">
            My Surveys
          </Link>
        </li>
        {userRole === "admin" && (
          <li>
            <Link to="/users" className="hover:text-gray-300">
              Users
            </Link>
          </li>
        )}
      </ul>

      {isLoggedIn && (
        <div className="flex items-center space-x-4">
          <span>
            Welcome, {userEmail}{" "}
            <span className="text-sm text-gray-400">({userRole})</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;
