import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authenticatedFetch from './authenticatedFetch';
import Spinner from './Spinner';

function SurveyCards({ surveys }) {
  const [surveyImages, setSurveyImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const images = {};
      for (let survey of surveys) {
        try {
          const response = await authenticatedFetch(`https://vigilant-orbit-v6x6pp4w99636w9v-3000.app.github.dev/get-image-url/${survey._id}`);
          if (response.ok) {
            const data = await response.json();
            images[survey._id] = data.imageUrl;
          }
        } catch (error) {
          console.error('Error fetching image for survey:', survey._id, error);
        }
      }
      setSurveyImages(images);
      setLoading(false);
    };

    fetchImages();
  }, [surveys]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {surveys.map((survey) => (
        <div key={survey._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 p-4">
          <h2 className="font-semibold text-lg">{survey.title}</h2>
          <p className="text-gray-600">{survey.description}</p>
          <img 
            src={surveyImages[survey._id] || '/path-to-placeholder-image.jpg'} 
            alt="Survey" 
            className="w-full h-32 object-cover rounded mt-2" 
          />
          <Link 
            to={`/survey/${survey._id}`}
            className="mt-3 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300 block text-center"
          >
            Start Survey
          </Link>
        </div>
      ))}
    </div>
  );
}

export default SurveyCards;
