import React, { useState } from 'react';
import './styles.css';

export default function Quiz({ title = "Check Your Knowledge", questions = [] }) {
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState(Array(questions.length).fill(false));

  const handleAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setShowResults(false);
    setShowExplanations(Array(questions.length).fill(false));
  };

  const toggleExplanation = (index) => {
    const newExplanations = [...showExplanations];
    newExplanations[index] = !newExplanations[index];
    setShowExplanations(newExplanations);
  };

  const score = userAnswers.reduce((sum, answer, index) => {
    return answer === questions[index].correctIndex ? sum + 1 : sum;
  }, 0);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>{title}</h3>
        {showResults && (
          <div className="quiz-score">
            Score: <strong>{score}</strong> / {questions.length}
          </div>
        )}
      </div>

      {questions.map((q, questionIndex) => (
        <div 
          key={questionIndex} 
          className={`quiz-question ${
            showResults 
              ? userAnswers[questionIndex] === q.correctIndex 
                ? "correct-answer"
                : "incorrect-answer"
              : ""
          }`}
        >
          <div className="question-text">
            <strong>Question {questionIndex + 1}:</strong> {q.question}
          </div>
          
          <div className="options-container">
            {q.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`option ${
                  userAnswers[questionIndex] === optionIndex 
                    ? "selected-option" 
                    : ""
                } ${
                  showResults && optionIndex === q.correctIndex 
                    ? "correct-option" 
                    : showResults && userAnswers[questionIndex] === optionIndex 
                      ? "incorrect-option" 
                      : ""
                }`}
                onClick={() => !showResults && handleAnswer(questionIndex, optionIndex)}
              >
                <div className="option-text">
                  {option}
                </div>
              </div>
            ))}
          </div>

          {showResults && (
            <div className="explanation-section">
              <button 
                className="explanation-toggle"
                onClick={() => toggleExplanation(questionIndex)}
              >
                {showExplanations[questionIndex] ? "Hide Explanation" : "Show Explanation"}
              </button>
              
              {showExplanations[questionIndex] && (
                <div className="explanation">
                  {q.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="quiz-controls">
        {!showResults ? (
          <button 
            onClick={handleCheck}
            disabled={userAnswers.some(answer => answer === null)}
            className="check-button"
          >
            Check Answers
          </button>
        ) : (
          <button onClick={handleReset} className="reset-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}