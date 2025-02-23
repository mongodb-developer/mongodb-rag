import React, { useState } from 'react';
import './styles.css';

export default function Quiz({ title = "Check Your Knowledge", questions = [] }) {
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState(Array(questions.length).fill(false));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    setCurrentQuestionIndex(0);
  };

  const toggleExplanation = (index) => {
    const newExplanations = [...showExplanations];
    newExplanations[index] = !newExplanations[index];
    setShowExplanations(newExplanations);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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

      <div 
        className={`quiz-question ${
          showResults 
            ? userAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correctIndex 
              ? "correct-answer"
              : "incorrect-answer"
            : ""
        }`}
      >
        <div className="question-text">
          <strong>Question {currentQuestionIndex + 1}:</strong> {questions[currentQuestionIndex].question}
        </div>
        
        <div className="options-container">
          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <div 
              key={optionIndex}
              className={`option ${
                userAnswers[currentQuestionIndex] === optionIndex 
                  ? "selected-option" 
                  : ""
              } ${
                showResults && optionIndex === questions[currentQuestionIndex].correctIndex 
                  ? "correct-option" 
                  : showResults && userAnswers[currentQuestionIndex] === optionIndex 
                    ? "incorrect-option" 
                    : ""
              }`}
              onClick={() => !showResults && handleAnswer(currentQuestionIndex, optionIndex)}
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
              onClick={() => toggleExplanation(currentQuestionIndex)}
            >
              {showExplanations[currentQuestionIndex] ? "Hide Explanation" : "Show Explanation"}
            </button>
            
            {showExplanations[currentQuestionIndex] && (
              <div className="explanation">
                {questions[currentQuestionIndex].explanation}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-controls">
        <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="back-button">
          Back
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="next-button">
          Next
        </button>
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