// Function to call the API for saving a survey
export async function saveSurvey(surveyData) {
    const token = localStorage.getItem("accessToken");
  
    const response = await fetch(
      "https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/create-survey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(surveyData),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Error saving survey: ${response.status}`);
    }
  
    return response.json();
  }