import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import authenticatedFetch from "./authenticatedFetch";
import BackButton from "./BackButton";

function SegmentUsers() {
  const { segmentId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegmentUsers = async () => {
      try {
        const response = await authenticatedFetch(
          `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/users-by-segment/${segmentId}`
        );
        if (response.ok) {
          const data = await response.json();

          console.log("Response data: ", data);

          setUsers(data);
        } else {
          alert("Error fetching segment users.");
        }
      } catch (error) {
        console.error("Error fetching segment users:", error);
      }
      setLoading(false);
    };

    fetchSegmentUsers();
    
  }, [segmentId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 shadow-lg">
        <BackButton />
      <h2 className="text-2xl font-bold mb-4">Segment Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">First Name</th>
              <th className="py-3 px-6">Last Name</th>
              <th className="py-3 px-6">City</th>
              <th className="py-3 px-6">Country</th>
              <th className="py-3 px-6">Company</th>
              <th className="py-3 px-6">Industry</th>
              <th className="py-3 px-6">Interests</th>
              <th className="py-3 px-6">Products</th>
              <th className="py-3 px-6">NPS</th>
              {/* Add more headers if needed */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="py-4 px-6">{user.email}</td>
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
                {/* Add more cells if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SegmentUsers;
