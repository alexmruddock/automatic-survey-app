import React, { useState, useEffect } from "react";
import authenticatedFetch from "./authenticatedFetch";
import { useNavigate } from "react-router-dom";

function SegmentManager() {
  const navigate = useNavigate();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    criteria: [{ key: "", operator: "includes", value: "" }],
  });

  // Fetch all segments
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await authenticatedFetch(
          `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/segments`
        );
        const data = await response.json();
        setSegments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching segments:", error);
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  // Update the new segment in the form
  const handleNewSegmentChange = (event) => {
    setNewSegment({ ...newSegment, [event.target.name]: event.target.value });
  };

  // Update the criteria in the targeting editor
  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = newSegment.criteria.map((criteria, i) =>
      i === index ? { ...criteria, [field]: value } : criteria
    );
    setNewSegment({ ...newSegment, criteria: updatedCriteria });
  };

  // Add a new criteria to the targeting editor
  const addCriteria = () => {
    setNewSegment({
      ...newSegment,
      criteria: [
        ...newSegment.criteria,
        { key: "", operator: "includes", value: "" },
      ],
    });
  };

  // Remove a specific criterion from the new segment
  const removeCriteria = (index) => {
    const filteredCriteria = newSegment.criteria.filter((_, i) => i !== index);
    setNewSegment({ ...newSegment, criteria: filteredCriteria });
  };

  // Submit new segment
  const handleNewSegmentSubmit = async (event) => {
    event.preventDefault();

    // Check if all criteria have a key selected
    const allCriteriaValid = newSegment.criteria.every(
      (criteria) => criteria.key !== ""
    );
    if (!allCriteriaValid) {
      alert("Please select a key for all criteria.");
      return;
    }

    try {
      console.log("Submitting new segment: ", JSON.stringify(newSegment));
      const response = await authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/create-segment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSegment),
        }
      );

      if (response.ok) {
        alert("Segment created successfully");
        window.location.reload();
      } else {
        alert("Failed to create segment");
      }
    } catch (error) {
      console.error("Error creating segment:", error);
    }
  };

  // navigate to edit page for a segment
  const handleEditSegment = (segmentId) => {
    navigate(`/edit-segment/${segmentId}`);
  };

  // delete segment function
  const handleDeleteSegment = async (segmentId) => {
    if (window.confirm("Are you sure you want to delete this segment?")) {
      try {
        const response = await authenticatedFetch(
          `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/delete-segment/${segmentId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          alert("Segment deleted successfully");
          //fetchSegments(); // Fetch the updated list of segments
        } else {
          alert("Failed to delete segment");
        }
      } catch (error) {
        console.error("Error deleting segment:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Segment Manager
      </h1>

      <form
        onSubmit={handleNewSegmentSubmit}
        className="max-w-md mx-auto mt-8 bg-white shadow-md rounded-md p-6"
      >
        <label className="block text-gray-700 font-medium mb-2">
          New Segment Name:
          <input
            type="text"
            name="name"
            value={newSegment.name}
            onChange={handleNewSegmentChange}
            className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
        </label>
        <label className="block text-gray-700 font-medium mb-2">
          New Segment Description:
          <input
            type="text"
            name="description"
            value={newSegment.description}
            onChange={handleNewSegmentChange}
            className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        {newSegment.criteria.map((criteria, index) => (
          <div
            key={index}
            className="my-4 flex flex-col items-start space-y-2 bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            <select
              name="key"
              value={criteria.key}
              onChange={(e) =>
                handleCriteriaChange(index, "key", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Profile Field</option>
              <option value="city">City</option>
              <option value="country">Country</option>
              <option value="company">Company</option>
              <option value="industry">Industry</option>
              <option value="interests">Interests</option>
              <option value="products">Products</option>
              <option value="nps">NPS</option>
            </select>
            <select
              name="operator"
              value={criteria.operator}
              onChange={(e) =>
                handleCriteriaChange(index, "operator", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="includes">Includes</option>
              <option value="excludes">Excludes</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
            </select>
            <input
              name="value"
              value={criteria.value}
              onChange={(e) =>
                handleCriteriaChange(index, "value", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeCriteria(index)}
              className="w-1/4 bg-red-500 text-white font-bold rounded-md px-4 py-2 hover:bg-red-700 self-end"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={addCriteria}
            className="bg-gray-500 text-white font-bold rounded-md px-4 py-2 hover:bg-gray-700"
          >
            Add Criteria
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold rounded-md px-4 py-2 hover:bg-blue-700"
          >
            Create Segment
          </button>
        </div>
      </form>

      <h2 className="text-3xl font-bold text-center text-gray-800 mt-12">
        Existing Segments
      </h2>
      {segments.map((segment) => (
        <div
          key={segment._id}
          className="max-w-md mx-auto mt-8 bg-gray-100 shadow-md rounded-md p-6"
        >
          <h3 className="text-2xl font-medium text-gray-900">{segment.name}</h3>
          <p className="text-gray-700 mt-2">{segment.description}</p>
          {/* Display segment criteria overview */}

          <div className="mt-4">
            {segment.criteria.map((criteria, index) => (
              <div key={index}>
                {criteria.key} {criteria.operator} {criteria.value}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleEditSegment(segment._id)}
            className="block w-full mt-4 bg-yellow-600 text-white font-bold rounded-md px-4 py-3 hover:bg-yellow-700 text-center"
          >
            Edit
          </button>

          <button
            onClick={() => navigate(`/segment-users/${segment._id}`)}
            className="block w-full mt-4 bg-blue-600 text-white font-bold rounded-md px-4 py-3 hover:bg-blue-700 text-center"
          >
            View Users
          </button>

          <button
            onClick={() => handleDeleteSegment(segment._id)}
            className="block w-full mt-4 bg-red-600 text-white font-bold rounded-md px-4 py-3 hover:bg-red-700 text-center"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default SegmentManager;
