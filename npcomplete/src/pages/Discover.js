import React, { useState, useEffect } from 'react';
import './Auth.css'; // Changed from Discover.css
import './Discover.anim.css';

// Sends survey result to backend and returns the response
const sendSurveyToBackend = async (result) => {
  try {
    const response = await fetch('http://localhost:5000/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending survey:', error);
    return null;
  }
};

function CompletionScreen({ questions, answers, onRestart }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const result = questions.map((q, i) => ({ question: q.question, answer: answers[i] }));
  const jsonResult = JSON.stringify(result, null, 2);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await sendSurveyToBackend(result);
      setApiResponse(response);
      setLoading(false);
    };
    fetchResults();
  }, []); // Only run once when mounted

  return (
    <>
      <h1>Survey Complete!</h1>
      <p>Thank you for completing the survey. We'll help match you with the perfect nonprofit opportunities!</p>
      
      <h3>Your Answers:</h3>
      <pre style={{
        textAlign: 'left',
        background: '#f3f3f3',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        overflowX: 'auto',
        marginBottom: '1.5rem'
      }}>{jsonResult}</pre>

      <h3>Your Results:</h3>
      {loading ? (
        <p>Loading results...</p>
      ) : apiResponse && apiResponse.results && apiResponse.results.length > 0 ? (
        <pre style={{
          textAlign: 'left',
          background: '#f3f3f3',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          overflowX: 'auto',
          marginBottom: '1.5rem',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {apiResponse.results.map((hit, idx) => {
            const org = hit._source || {};
            const name = org.name || 'Unnamed Organization';
            const city = org.city;
            const state = org.state;
            const ntee = org.ntee;
            const ein = org.ein;
            
            let line = name;
            if (city || state) {
              line += ` (${city || ''}${city && state ? ', ' : ''}${state || ''})`;
            }
            if (ntee) {
              line += ` — NTEE ${ntee}`;
            }
            if (ein) {
              line += ` — EIN ${ein}`;
            }
            return line + '\n';
          }).join('')}
        </pre>
      ) : (
        <p style={{ color: '#666' }}>No matching nonprofits found. Try adjusting your answers!</p>
      )}

      <button className="submit-button" onClick={onRestart}>
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
      question: "Where are you located? (City)",
      inputType: "text"
    },
    {
      id: 3,
      question: "What organization size do you prefer to support?",
      options: [
        "Small (Less than $100K)",
        "Medium ($100K–$1M)",
        "Large (More than $1M)"
      ]
    },
    {
      id: 4,
      question: "Would you prefer newer nonprofits (under 5 years old) or established ones (10+ years)?",
      options: [
        "Newer (under 5 years old)",
        "Established (10+ years)"
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
    },
    {
      id: 6,
      question: "What is your email?",
      inputType: "email"
    },
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
      <button className="submit-button" onClick={handleStart}>Start!</button> {/* Changed from start-button */}
    </>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    // Free text input for question 2 and email input for question 6
    if (question.inputType === "text" || question.inputType === "email") {
      return (
        <>
          <button className="reset-button" onClick={handleReset} title="Reset Survey">
          </button>
          <h2>Question {currentQuestion + 1} of {questions.length}</h2>
          <h3 className="question-text">{question.question}</h3>
          <div className="options-container">
            <input
              type={question.inputType}
              className="option-text-input"
              value={currentAnswer || ''}
              onChange={e => {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder={question.inputType === 'email' ? 'Enter your email...' : 'Enter your location...'}
              style={{ fontSize: '1.1rem', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
            />
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
              onClick={() => handleAnswer(currentAnswer || '')}
              disabled={!currentAnswer || currentAnswer.trim() === ''}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </>
      );
    }

    // Default: multiple choice
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
    <div className="auth-page"> {/* Changed from discover-page */}
      <div className="auth-container anim-rel-parent"> {/* Changed from discover-container */}
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
        <div className="auth-card" ref={cardRef}> {/* Changed from discover-card */}
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