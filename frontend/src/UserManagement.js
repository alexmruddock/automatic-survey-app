import React, { useState, useEffect } from "react";
import authenticatedFetch from "./authenticatedFetch";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authenticatedFetch(
      "https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/users"
    )
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleRoleChange = (userId, newRole) => {
    authenticatedFetch(
      `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/update-user/${userId}`,
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
        `https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/delete-user/${userId}`,
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

  return (
    <div className="p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
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
                <td className="py-4 px-6">
              {user.role !== "admin" && (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300 mr-2"
                    onClick={() => handleRoleChange(user._id, "admin")}
                  >
                    Make Admin
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300"
                    onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;
