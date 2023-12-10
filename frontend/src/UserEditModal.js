import React, { useState } from "react";
import { useEffect } from "react";

function UserEditModal({ user, isOpen, onClose, onSave }) {
  // Initialize profile state outside of any conditions
  const [profile, setProfile] = useState({});

  // Update state when the user prop changes
  useEffect(() => {
    if (user && user.profile) {
      setProfile(user.profile);
    } else {
      setProfile({}); // Reset or set to default values if user or user.profile is null
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    onSave(user._id, profile);
    onClose();
  };

  // Early return for when modal should not be rendered
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <span className="absolute top-0 right-0 p-4" onClick={onClose}>
          <svg
            className="h-6 w-6 text-gray-600 hover:text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>

        <h2>Edit User Profile</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            City
          </label>
          <input
            type="text"
            name="city"
            value={profile.city || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Country
          </label>
          <input
            type="text"
            name="country"
            value={profile.country || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Company
          </label>
          <input
            type="text"
            name="company"
            value={profile.company || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={profile.industry || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Interests
          </label>
          <input
            type="text"
            name="interests"
            value={profile.interests || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Products
          </label>
          <input
            type="text"
            name="products"
            value={profile.products || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            How likely would you be to recommend our product to a friend or
            colleague?
          </label>
          <input
            type="text"
            name="nps"
            value={profile.nps || ""}
            onChange={handleInputChange}
            className="input-field-class"
          />
        </div>

        <button className="button-class" onClick={handleSave}>
          Save Changes
        </button>
        
      </div>
    </div>
  );
}

export default UserEditModal;
