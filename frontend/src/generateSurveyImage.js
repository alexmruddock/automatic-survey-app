import authenticatedFetch from './authenticatedFetch';

// Function to call the API for generating an image prompt
const generateImagePrompt = async (title, description) => {
  try {
    const response = await authenticatedFetch(
      'https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/generate-image-prompt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.prompt;
    } else {
      throw new Error('Failed to generate image prompt');
    }
  } catch (error) {
    console.error('Error in generateImagePrompt:', error);
    throw error;
  }
};

// Function to call the API to generate an image based on the prompt
const generateImage = async (prompt) => {
    try {
        const response = await authenticatedFetch(
          'https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/generate-image', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
          }
        );
    
        if (response.ok) {
          const data = await response.json();
          return data.imageUrl;
        } else {
          throw new Error('Failed to generate image');
        }
      } catch (error) {
        console.error('Error in generateImage:', error);
        throw error;
      }
};

// Main function to be exported and used in survey creation
export const generateSurveyImage = async (surveyData) => {
  const prompt = await generateImagePrompt(surveyData);
  console.log("Prompt for DallE-3: ", prompt);
  const imageUrl = await generateImage(prompt);
  console.log(imageUrl);
  return imageUrl;
};
