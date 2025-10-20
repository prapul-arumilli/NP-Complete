import React, { useState, useEffect } from 'react';
import './Discover.css';
import './Discover.anim.css';

// Sends survey result to backend
const sendSurveyToBackend = async (result) => {
  try {
    await fetch('http://localhost:5000/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });
  } catch (error) {
    console.error('Error sending survey:', error);
  }
};

function CompletionScreen({ questions, answers, onRestart }) {
  const result = questions.map((q, i) => ({ question: q.question, answer: answers[i] }));
  const jsonResult = JSON.stringify(result, null, 2);

  useEffect(() => {
    sendSurveyToBackend(result);
  }, []); // Only run once when mounted

  return (
    <>
      <h1>Survey Complete!</h1>
      <p>Thank you for completing the survey. We'll help match you with the perfect nonprofit opportunities!</p>
      <h3>Your Answers (JSON):</h3>
      <pre style={{
        textAlign: 'left',
        background: '#f3f3f3',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.95rem',
        overflowX: 'auto',
        marginBottom: '1.5rem'
      }}>{jsonResult}</pre>
      <button className="start-button" onClick={onRestart}>
        Start Over
      </button>
    </>
  );
}

function Discover() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState([]);
  const [showClassroomAnim, setShowClassroomAnim] = useState(false);
  const [showClassroomAnimRight, setShowClassroomAnimRight] = useState(false);
  const [popupLeft, setPopupLeft] = useState(null);
  const [popupRight, setPopupRight] = useState(null);
  const cardRef = React.useRef();

  const questions = [
    {
      id: 1,
      question: "What type of cause are you most passionate about?",
      options: [
        "Education & Youth Development",
        "Environmental Conservation",
        "Health & Medical",
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
      question: "What group would you like to work with?",
      options: [
        "1",
        "2",
        "3",
        "4"
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

    // Animation for Q1: Education & Youth Development
    if (currentQuestion === 0 && selectedOption === 'Education & Youth Development') {
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const popupWidth = 650;
        const leftSpace = cardRect.left;
        const left = Math.max(0, leftSpace / 2 - popupWidth / 2);
        setPopupLeft(left);
        setShowClassroomAnim(true);
        setTimeout(() => setShowClassroomAnim(false), 2200);
        const rightSpace = window.innerWidth - cardRect.right;
        const right = Math.max(0, cardRect.right + rightSpace / 2 - popupWidth / 2);
        setPopupRight(right);
        setShowClassroomAnimRight(true);
        setTimeout(() => setShowClassroomAnimRight(false), 2200);
      }
    }
    // Animation for Q1: Environmental Conservation
    if (currentQuestion === 0 && selectedOption === 'Environmental Conservation') {
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const popupWidth = 650;
        const leftSpace = cardRect.left;
        const left = Math.max(0, leftSpace / 2 - popupWidth / 2);
        setPopupLeft(left);
        setShowClassroomAnim(true);
        setTimeout(() => setShowClassroomAnim(false), 2200);
        const rightSpace = window.innerWidth - cardRect.right;
        const right = Math.max(0, cardRect.right + rightSpace / 2 - popupWidth / 2);
        setPopupRight(right);
        setShowClassroomAnimRight(true);
        setTimeout(() => setShowClassroomAnimRight(false), 2200);
      }
    }
    // Animation for Q1: Health & Medical
    if (currentQuestion === 0 && selectedOption === 'Health & Medical') {
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const popupWidth = 650;
        const leftSpace = cardRect.left;
        const left = Math.max(0, leftSpace / 2 - popupWidth / 2);
        setPopupLeft(left);
        setShowClassroomAnim(true);
        setTimeout(() => setShowClassroomAnim(false), 2200);
        const rightSpace = window.innerWidth - cardRect.right;
        const right = Math.max(0, cardRect.right + rightSpace / 2 - popupWidth / 2);
        setPopupRight(right);
        setShowClassroomAnimRight(true);
        setTimeout(() => setShowClassroomAnimRight(false), 2200);
      }
    }
    // Animation for Q1: Poverty & Homelessness
    if (currentQuestion === 0 && selectedOption === 'Poverty & Homelessness') {
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const popupWidth = 650;
        const leftSpace = cardRect.left;
        const left = Math.max(0, leftSpace / 2 - popupWidth / 2);
        setPopupLeft(left);
        setShowClassroomAnim(true);
        setTimeout(() => setShowClassroomAnim(false), 2200);
        const rightSpace = window.innerWidth - cardRect.right;
        const right = Math.max(0, cardRect.right + rightSpace / 2 - popupWidth / 2);
        setPopupRight(right);
        setShowClassroomAnimRight(true);
        setTimeout(() => setShowClassroomAnimRight(false), 2200);
      }
    }

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

  const handleReset = () => {
    setCurrentQuestion(-1);
    setAnswers([]);
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
        <button className="reset-button" onClick={handleReset} title="Reset Survey">
        </button>
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
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Skip →'}
          </button>
        </div>
      </>
    );
  };



  return (
    <div className="discover-page">
      <div className="discover-container anim-rel-parent">
        {/* Animation image floats under the card, does not affect layout */}
        {showClassroomAnim && (
          <div
            className="classroom-anim-under"
            style={popupLeft !== null ? { left: popupLeft + 'px', position: 'fixed', top: 0, height: '100vh' } : {}}
          >
            <img
                src={
                  answers[0] === 'Environmental Conservation'
                    ? '/forest.png'
                    : answers[0] === 'Health & Medical'
                    ? '/doctorM.png'
                    : answers[0] === 'Poverty & Homelessness'
                    ? '/house.png'
                    : '/book.png'
                }
              alt="Classroom Animation"
              className="classroom-anim-img"
              style={{ width: '650px', maxWidth: '98vw' }}
            />
          </div>
        )}
        {showClassroomAnimRight && (
          <div
            className="classroom-anim-under"
            style={popupRight !== null ? { left: popupRight + 'px', position: 'fixed', top: 0, height: '100vh' } : {}}
          >
            <img
                src={
                  answers[0] === 'Environmental Conservation'
                    ? '/forest.png'
                    : answers[0] === 'Health & Medical'
                    ? '/doctorF.png'
                    : answers[0] === 'Poverty & Homelessness'
                    ? '/house.png'
                    : '/book.png'
                }
              alt="Classroom Animation"
              className="classroom-anim-img"
              style={{ width: '650px', maxWidth: '98vw' }}
            />
          </div>
        )}
        <div className="discover-card" ref={cardRef}>
          {currentQuestion === -1 && renderWelcomeScreen()}
          {currentQuestion >= 0 && currentQuestion < questions.length && renderQuestion()}
          {currentQuestion === -2 && (
            <CompletionScreen
              questions={questions}
              answers={answers}
              onRestart={() => { setCurrentQuestion(-1); setAnswers([]); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
