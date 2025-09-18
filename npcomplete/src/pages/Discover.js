import React, { useState } from 'react';
import './Discover.css';

function Discover() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      id: 1,
      question: "What type of cause are you most passionate about?",
      options: [
        "Education & Youth Development",
        "Environmental Conservation",
        "Health & Medical Research",
        "Poverty & Homelessness"
      ]
    },
    {
      id: 2,
      question: "How would you prefer to contribute your time?",
      options: [
        "Direct hands-on work with people",
        "Behind-the-scenes administrative tasks",
        "Fundraising and event planning",
        "Online/remote volunteer work"
      ]
    },
    {
      id: 3,
      question: "What age group would you like to work with?",
      options: [
        "Children (0-12 years)",
        "Teenagers (13-18 years)",
        "Adults (19-64 years)",
        "Seniors (65+ years)"
      ]
    },
    {
      id: 4,
      question: "How much time can you commit per week?",
      options: [
        "1-2 hours",
        "3-5 hours",
        "6-10 hours",
        "More than 10 hours"
      ]
    },
    {
      id: 5,
      question: "What type of work environment do you prefer?",
      options: [
        "Office/Indoor setting",
        "Outdoor activities",
        "Community centers",
        "Virtual/Online work"
      ]
    }
  ];

  const handleStart = () => {
    setCurrentQuestion(0);
  };

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption; // Store answer at current question index
    setAnswers(newAnswers);
    
    // Log the current answer and all answers so far
    console.log('Selected answer:', selectedOption);
    console.log('All answers so far:', newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions completed
      console.log('Survey completed! Final answers:', newAnswers);
      setCurrentQuestion(-2); // -2 for completion screen
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions completed
      console.log('Survey completed! Final answers:', answers);
      setCurrentQuestion(-2);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderWelcomeScreen = () => (
    <>
      <h1>Discover</h1>
      <p>Complete a short survey and we can help match you with a nonprofit!</p>
      <button className="start-button" onClick={handleStart}>Start!</button>
    </>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];
    
    return (
      <>
        <h2>Question {currentQuestion + 1} of {questions.length}</h2>
        <h3 className="question-text">{question.question}</h3>
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${currentAnswer === option ? 'selected' : ''}`}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="navigation-buttons">
          <button 
            className="nav-button back-button" 
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← Back
          </button>
          <button 
            className="nav-button next-button" 
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </>
    );
  };

  const renderCompletionScreen = () => (
    <>
      <h1>Survey Complete!</h1>
      <p>Thank you for completing the survey. We'll help match you with the perfect nonprofit opportunities!</p>
      <button className="start-button" onClick={() => {setCurrentQuestion(-1); setAnswers([]);}}>
        Start Over
      </button>
    </>
  );

  return (
    <div className="discover-page">
      <div className="discover-container">
        <div className="discover-card">
          {currentQuestion === -1 && renderWelcomeScreen()}
          {currentQuestion >= 0 && currentQuestion < questions.length && renderQuestion()}
          {currentQuestion === -2 && renderCompletionScreen()}
        </div>
      </div>
    </div>
  );
}

export default Discover;
