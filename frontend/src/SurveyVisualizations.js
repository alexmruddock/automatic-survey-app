import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyBarChart from "./MyBarChart"; // Import your chart components
import authenticatedFetch from "./authenticatedFetch";
import MyHistogram from "./MyHistogram";
import BackButton from "./BackButton"; // Import the BackButton component

function SurveyVisualizations() {
  const [visualizationData, setVisualizationData] = useState([]);
  const { surveyId } = useParams();
  console.log(surveyId);

  useEffect(() => {
    Promise.all([
      authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/survey-responses/${surveyId}/visualize`
      ),
      authenticatedFetch(
        `https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/retrieve-survey/${surveyId}`
      ),
    ])
      .then(async ([response1, response2]) => {
        const response1Text = await response1.text();
        console.log("Response 1:", response1Text);
        const response2Text = await response2.text();
        console.log("Response 2:", response2Text);

        let aggregatedData;
        let surveyData;
        try {
          aggregatedData = JSON.parse(response1Text);
          surveyData = JSON.parse(response2Text);
        } catch (error) {
          console.error("Error parsing server response:", error);
          return;
        }

        // Transform the data into the format expected by the chart components
        const visualizations = Object.keys(aggregatedData).map((question) => {
          // Find the question type for this question
          const questionData = surveyData.questions.find(
            (q) => q.question === question
          );
          return {
            question,
            questionType: questionData.question_type,
            data: aggregatedData[question],
          };
        });

        // Set the transformed data in state
        setVisualizationData(visualizations);
        console.log("Visualizations data: ", visualizations);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [surveyId]);

  const renderVisualization = (visualization, key) => {
    // Transform the data for the chart
    const chartData = visualization.data.map((item) => ({
      name: item._id, // or item.question or another field, depending on your data structure
      value: item.count, // or another field, depending on your data structure
    }));

    // Determine the appropriate chart component based on the question type
    let ChartComponent;
    switch (visualization.questionType) {
      case "multiple_choice":
        ChartComponent = MyBarChart;
        break;
      case "rating_scale":
      case "rating":
        ChartComponent = MyHistogram;
        break;
      // Add other cases as needed
      default:
        ChartComponent = () => <p>No visualization available for this question type</p>;
    }

    return (
      <div key={key} className="mb-6">
        <h3 className="text-lg font-medium mb-2">{visualization.question}</h3>
        <ChartComponent data={chartData} />
      </div>
    );
  };

  return (
    <div className="p-4 shadow-lg">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Survey Visualizations</h2>
      {visualizationData.map((visualization, index) =>
        renderVisualization(visualization, index)
      )}
    </div>
  );
}

export default SurveyVisualizations;
