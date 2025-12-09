import React, { useState, useEffect } from 'react';
import './Auth.css'; // Changed from Discover.css
import './Discover.anim.css';

// ...existing code...
function CompletionScreen({ questions, answers, onRestart }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      // Find the CITY answer (question 2, index 1)
      const userCity = answers[1] ? String(answers[1]).trim() : '';
      if (!userCity) {
        setResults([]);
        setLoading(false);
        return;
      }
      const endpoint = 'http://127.0.0.1:5000/api/search';
      const body = {
        query: {
          query: {
            match: { city: userCity }
          }
        },
        from: 0,
        size: 5
      };
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        const hits = Array.isArray(data) ? data : data.hits || [];
        setResults(hits);
      } catch (err) {
        setError('Failed to load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [answers]);

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem 0',
      background: '#fff',
    }}>
      <h1>Survey Complete!</h1>
      <p>Thank you for completing the survey. We'll help match you with the perfect nonprofit opportunities!</p>

      <h3>Your Results:</h3>
      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : results.length > 0 ? (
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '96vw',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {results.slice(0, 5).map((result, idx) => {
            const src = result._source || {};
            return (
              <div
                key={result._id || idx}
                className="explore-card"
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '1.25rem 2rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  width: '100%',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#111827' }}>
                  {src.name || src.NAME || 'Unnamed Nonprofit'}
                </h3>
                <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                  {(src.city || src.CITY) && (src.state || src.STATE) ? `${src.city || src.CITY}, ${src.state || src.STATE}` : 'Location Unknown'}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#2563eb', fontSize: '0.9rem', fontWeight: 500 }}>
                  {src.ntee || src.NTEE_TITLE || 'No Category'}
                </p>
                <p
                  style={{
                    marginTop: '0.75rem',
                    color: '#374151',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    wordWrap: 'break-word',
                  }}
                >
                  {src.ntee_description || src.NTEE_DESCRIPTION || 'No description available.'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: '#666' }}>No matching nonprofits found. Try adjusting your answers!</p>
      )}

      <button className="submit-button" onClick={onRestart} style={{ marginTop: '2rem' }}>
        Start Over
      </button>
    </div>
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
        "Legal Aid & Human Rights",
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