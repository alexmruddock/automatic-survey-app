import React, { useState, useEffect } from "react";
import authenticatedFetch from "./authenticatedFetch";
import UserEditModal from "./UserEditModal";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authenticatedFetch(
      "https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/users"
    )
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleRoleChange = (userId, newRole) => {
    authenticatedFetch(
      `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/update-user/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      }
    )
      .then((response) => {
        if (response.ok) {
          // Update the local users state to reflect the change
          setUsers(
            users.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );
          alert("User role updated successfully.");
        } else {
          alert("Failed to update user role.");
        }
      })
      .catch((error) => console.error("Error updating user role:", error));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/delete-user/${userId}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (response.ok) {
            // Remove the user from the local state
            setUsers(users.filter((user) => user._id !== userId));
            alert("User deleted successfully.");
          } else {
            alert("Failed to delete user.");
          }
        })
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUserProfile = (userId, updatedProfile) => {
    authenticatedFetch(
      `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/update-profile/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      }
    )
      .then((response) => {
        if (response.ok) {
          // Update the local users state to reflect the profile changes
          setUsers(
            users.map((user) =>
              user._id === userId ? { ...user, profile: updatedProfile } : user
            )
          );
          alert("User profile updated successfully.");
        } else {
          alert("Failed to update user profile.");
        }
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  const [showDropdown, setShowDropdown] = useState(null);

  // Add a click event to close the dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(null);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">First Name</th>
              <th className="py-3 px-6">Last Name</th>
              <th className="py-3 px-6">City</th>
              <th className="py-3 px-6">Country</th>
              <th className="py-3 px-6">Company</th>
              <th className="py-3 px-6">Industry</th>
              <th className="py-3 px-6">Interests</th>
              <th className="py-3 px-6">Products</th>
              <th className="py-3 px-6">NPS</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">{user.role}</td>
                <td className="py-4 px-6">{user.profile.firstName}</td>
                <td className="py-4 px-6">{user.profile.lastName}</td>
                <td className="py-4 px-6">{user.profile.city}</td>
                <td className="py-4 px-6">{user.profile.country}</td>
                <td className="py-4 px-6">{user.profile.company}</td>
                <td className="py-4 px-6">{user.profile.industry}</td>
                <td className="py-4 px-6">
                  {Array.isArray(user.profile.interests)
                    ? user.profile.interests.join(", ")
                    : ""}
                </td>
                <td className="py-4 px-6">
                  {Array.isArray(user.profile.products)
                    ? user.profile.products.join(", ")
                    : ""}
                </td>
                <td className="py-4 px-6">{user.profile.nps}</td>
                <td className="py-4 px-6 relative">
                  {user.role !== "admin" && (
                    <div>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300"
                        onClick={(e) => {
                          // Prevents the dropdown from closing immediately
                          e.stopPropagation();
                          setShowDropdown(
                            showDropdown === user._id ? null : user._id
                          );
                        }}
                      >
                        Actions
                      </button>
                      {showDropdown === user._id && (
                        <div className="absolute right-0 w-40 mt-2 py-2 bg-white border rounded shadow-xl z-10">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleRoleChange(user._id, "admin")}
                            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                          >
                            🔼 Make Admin
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="block px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentUser && (
        <UserEditModal
          user={currentUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateUserProfile}
        />
      )}
    </div>
  );
}

export default UserManagement;
