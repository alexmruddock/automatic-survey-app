function EditSurveyQuestion({ question, index, onQuestionChange, onOptionChange, onAddOption, onRemoveOption }) {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div key={index} className="mb-6 space-y-2">
            <input 
              type="text" 
              value={question.question} 
              onChange={(e) => onQuestionChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={option} 
                  onChange={(e) => onOptionChange(index, optionIndex, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                  onClick={() => onRemoveOption(index, optionIndex)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              onClick={() => onAddOption(index)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>
        );
  
      case 'rating_scale':
      case 'rating':
        return (
          <div key={index} className="mb-6">
            <input 
              type="text" 
              value={question.question} 
              onChange={(e) => onQuestionChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Additional inputs for setting the scale */}
          </div>
        );
  
      case 'open_ended':
      case 'open_text':
        return (
          <div key={index} className="mb-6">
            <textarea 
              value={question.question} 
              onChange={(e) => onQuestionChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
            ></textarea>
          </div>
        );
  
      default:
        return <p key={index} className="text-red-500">Unsupported question type: {question.type}</p>;
    }
  }
  
  export default EditSurveyQuestion;
