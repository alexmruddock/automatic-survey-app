function renderQuestion(question, index) {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div key={index} className="mb-4">
            <p className="font-medium text-gray-700">{question.question}</p>
            <div className="flex flex-col mt-2">
              {question.options.map(option => (
                <label key={option} className="inline-flex items-center mt-1">
                  <input type="radio" name={`question-${index}`} value={option} className="form-radio" />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
  
      case 'rating_scale':
      case 'rating':
        return (
          <div key={index} className="mb-4">
            <p className="font-medium text-gray-700">{question.question}</p>
            <input type="range" min="1" max={question.scale} className="mt-2 w-full" />
          </div>
        );
  
      case 'open_ended':
      case 'open_text': // Combining as they are similar
        return (
          <div key={index} className="mb-4">
            <p className="font-medium text-gray-700">{question.question}</p>
            <textarea name={`question-${index}`} className="mt-2 w-full p-2 border rounded" rows="3"></textarea>
          </div>
        );
  
      default:
        return <p key={index} className="text-red-500">Unsupported question type: {question.type}</p>;
    }
  }