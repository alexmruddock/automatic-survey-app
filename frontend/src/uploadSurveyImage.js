import authenticatedFetch from "./authenticatedFetch";

// Function to upload survey image to the server and then to S3 bucket
export const uploadSurveyImage = async (imageUrl) => {
  try {
    console.log("Image URL passed to uploadSurveyImage: ", imageUrl);

    const response = await authenticatedFetch(
      "https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/upload-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error in uploadSurveyImage:", error);
    throw error;
  }
};
