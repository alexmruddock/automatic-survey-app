import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authenticatedFetch from "./authenticatedFetch";
import BackButton from "./BackButton";

function EditSegment() {
  const { segmentId } = useParams();
  const navigate = useNavigate();
  const [segment, setSegment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the segment data
  useEffect(() => {
    const fetchSegment = async () => {
      try {
        const response = await authenticatedFetch(
          `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/segments/${segmentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSegment(data);
        } else {
          alert("Error fetching segment data.");
          navigate("/segments"); // Navigate back to segments list on error
        }
      } catch (error) {
        console.error("Error fetching segment:", error);
        navigate("/segments");
      }
      setLoading(false);
    };

    fetchSegment();
  }, [segmentId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/update-segment/${segmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(segment),
        }
      );

      if (response.ok) {
        alert("Segment updated successfully");
        navigate("/manage-segments"); // Navigate back to segments list
      } else {
        alert("Failed to update segment");
      }
    } catch (error) {
      console.error("Error updating segment:", error);
    }
  };

  // Handle changes to the name and description fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSegment({ ...segment, [name]: value });
  };

  // Handle changes to the criteria fields
  const handleCriteriaChange = (criteriaIndex, field, value) => {
    const updatedCriteria = segment.criteria.map((criteria, index) =>
      index === criteriaIndex ? { ...criteria, [field]: value } : criteria
    );
    setSegment({ ...segment, criteria: updatedCriteria });
  };

  // Add a new criterion to the segment
  const addCriteria = () => {
    const newCriterion = {
      key: "",
      operator: "includes", // Default operator, can be adjusted
      value: "",
    };

    // Add the new criterion to the criteria array
    setSegment({
      ...segment,
      criteria: [...segment.criteria, newCriterion],
    });
  };

  const removeCriteria = (index) => {
    const filteredCriteria = segment.criteria.filter((_, i) => i !== index);
    setSegment({ ...segment, criteria: filteredCriteria });
  };

  if (loading) return <div>Loading...</div>;
  if (!segment) return <div>Segment not found.</div>;

  return (
    <div className="container mx-auto p-4">
        <BackButton />
      <h1 className="text-4xl font-bold text-center">Edit Segment</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 bg-white shadow-md rounded-md p-6"
      >
        {/* Name field */}
        <label className="block text-gray-700 font-medium mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={segment.name || ""}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {/* Description field */}
        <label className="block text-gray-700 font-medium mb-2">
          Description:
          <textarea
            name="description"
            value={segment.description || ""}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {/* Criteria fields (similar to SegmentManager) */}
        {segment.criteria.map((criteria, index) => (
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
              type="text"
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
            Update Segment
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSegment;
