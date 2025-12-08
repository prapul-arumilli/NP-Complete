import React, { useState, useEffect, useRef } from 'react';
import './Auth.css';
import './Discover.anim.css';

function CompletionScreen({ questions, answers, onRestart }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
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
            match: { CITY: userCity }
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
                  {src.NAME || 'Unnamed Nonprofit'}
                </h3>
                <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                  {src.CITY && src.STATE ? `${src.CITY}, ${src.STATE}` : 'Location Unknown'}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#2563eb', fontSize: '0.9rem', fontWeight: 500 }}>
                  {src.NTEE_TITLE || 'No Category'}
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
                  {src.NTEE_DESCRIPTION || 'No description available.'}
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
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 = welcome, -2 = completion
  const [answers, setAnswers] = useState([]);
  const [showClassroomAnim, setShowClassroomAnim] = useState(false);
  const [showClassroomAnimRight, setShowClassroomAnimRight] = useState(false);
  const [popupLeft, setPopupLeft] = useState(null);
  const [popupRight, setPopupRight] = useState(null);
  const [animationImages, setAnimationImages] = useState({ left: null, right: null });
  const cardRef = useRef();
  const hideTimeoutsRef = useRef([]);

  const questions = [
    {
      id: 1,
      question: "What type of cause are you most passionate about?",
      options: [
        "Education & Youth Development",
        "Environmental Conservation",
        "Health & Medical",
        "Legal Aid & Human Rights"
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

  // cleanup on unmount
  useEffect(() => {
    return () => {
      hideTimeoutsRef.current.forEach(t => clearTimeout(t));
      hideTimeoutsRef.current = [];
    };
  }, []);

  // Image maps

  // Q1
  const getQ1Images = (answer0) => {
    if (answer0 === 'Environmental Conservation') return { left: '/forest.png', right: '/forest.png' };
    if (answer0 === 'Health & Medical') return { left: '/doctorM.png', right: '/doctorF.png' };
    if (answer0 === 'Legal Aid & Human Rights') return { left: '/humanrights.jpg', right: '/humanrights.jpg' };
    if (answer0 === 'Education & Youth Development') return { left: '/book.png', right: '/book.png' };
    return { left: '/book.png', right: '/book.png' };
  };

  // Q3
  const getQ3Images = (sel) => {
    if (sel === 'Small (Less than $100K)') return { left: '/small.png', right: '/small.png' };
    if (sel === 'Medium ($100K–$1M)') return { left: '/medium.png', right: '/medium.png' };
    if (sel === 'Large (More than $1M)') return { left: '/big.png', right: '/big.png' };
    return { left: '/small.png', right: '/small.png' };
  };

  // Q4
  const getQ4Images = (sel) => {
    if (sel === 'Newer (under 5 years old)') return { left: '/new.png', right: '/new.png' };
    if (sel === 'Established (10+ years)') return { left: '/established.png', right: '/established.png' };
    return { left: '/new.png', right: '/new.png' };
  };

  // Q5
  const getQ5Images = (sel) => {
    if (sel === 'Office/Indoor setting') return { left: '/office.png', right: '/office.png' };
    if (sel === 'Outdoor activities') return { left: '/outdoor.png', right: '/outdoor.png' };
    if (sel === 'Community centers') return { left: '/communitycenter.png', right: '/communitycenter.png' };
    if (sel === 'Virtual/Online work') return { left: '/online.png', right: '/online.png' };
    return { left: '/office.png', right: '/office.png' };
  };

  // Central animation trigger
  const triggerAnimation = (questionIndex, selectedOption) => {
    if (!cardRef.current) return;

    // choose images
    let imgs = { left: null, right: null };
    if (questionIndex === 0) {
      const answer0 = selectedOption || answers[0];
      imgs = getQ1Images(answer0);
    } else if (questionIndex === 2) {
      imgs = getQ3Images(selectedOption);
    } else if (questionIndex === 3) {
      imgs = getQ4Images(selectedOption);
    } else if (questionIndex === 4) {
      imgs = getQ5Images(selectedOption);
    } else {
      return; // no animation for other questions
    }

    // position calculation
    const cardRect = cardRef.current.getBoundingClientRect();
    const popupWidth = 650;
    const leftSpace = cardRect.left;
    const left = Math.max(0, leftSpace / 2 - popupWidth / 2);
    const rightSpace = window.innerWidth - cardRect.right;
    const right = Math.max(0, cardRect.right + rightSpace / 2 - popupWidth / 2);

    setAnimationImages(imgs);
    setPopupLeft(left);
    setPopupRight(right);

    // clear any existing timeouts
    hideTimeoutsRef.current.forEach(t => clearTimeout(t));
    hideTimeoutsRef.current = [];

    setShowClassroomAnim(true);
    setShowClassroomAnimRight(true);

    const t1 = setTimeout(() => setShowClassroomAnim(false), 2200);
    const t2 = setTimeout(() => setShowClassroomAnimRight(false), 2200);
    hideTimeoutsRef.current.push(t1, t2);
  };

  // Handlers & navigation
  const handleStart = () => setCurrentQuestion(0);

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    // trigger animations for Q1, Q3, Q4, Q5
    if ([0, 2, 3, 4].includes(currentQuestion)) {
      triggerAnimation(currentQuestion, selectedOption);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(-2);
    }

    console.log('Selected answer:', selectedOption);
    console.log('All answers so far:', newAnswers);
    if (currentQuestion === questions.length - 1) {
      console.log('Survey completed! Final answers:', newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setCurrentQuestion(-2);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleReset = () => {
    setCurrentQuestion(-1);
    setAnswers([]);
  };

  // Render helpers
  const renderWelcomeScreen = () => (
    <>
      <h1>Discover</h1>
      <p>Complete a short survey and we can help match you with a nonprofit!</p>
      <button className="submit-button" onClick={handleStart}>Start!</button>
    </>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    if (question.inputType === "text" || question.inputType === "email") {
      return (
        <>
          <button className="reset-button" onClick={handleReset} title="Reset Survey"></button>
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

    return (
      <>
        <button className="reset-button" onClick={handleReset} title="Reset Survey"></button>
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

  // JSX return
  return (
    <div className="auth-page">
      <div className="auth-container anim-rel-parent">

        {/* LEFT ANIMATION */}
        {showClassroomAnim && (
          <div
            className="classroom-anim-under"
            style={popupLeft !== null ? { left: popupLeft + 'px', position: 'fixed', top: 0, height: '100vh' } : {}}
          >
            <img
              src={animationImages.left}
              alt="Classroom Animation Left"
              className="classroom-anim-img"
              style={{ width: '400px', height: '400px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* RIGHT ANIMATION */}
        {showClassroomAnimRight && (
          <div
            className="classroom-anim-under"
            style={popupRight !== null ? { left: popupRight + 40 + 'px', position: 'fixed', top: 0, height: '100vh' } : {}}
          >
            <img
              src={animationImages.right}
              alt="Classroom Animation Right"
              className="classroom-anim-img"
              style={{ width: '400px', height: '400px', objectFit: 'contain' }}
            />
          </div>
        )}

        <div className="auth-card" ref={cardRef}>
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
