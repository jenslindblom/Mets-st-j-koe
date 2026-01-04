
import React, { useState, useEffect } from 'react';
import { QuizState, Question, QuestionType, QuizResults } from './types';
import { SAMPLE_QUESTIONS, EXAM_TIME_LIMIT, PASS_MARK, EXAM_QUESTION_COUNT, SPECIES_DB } from './constants';
import QuestionDisplay from './components/QuestionDisplay';
import FeedbackModal from './components/FeedbackModal';
import IdentificationGames from './components/IdentificationGames';
import MatchingGame from './components/MatchingGame';
import { resolveSpeciesImages } from './services/commonsImages';
import { uiFeedback } from './services/uiFeedbackService';
import { learningStore } from './services/learningStore';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isExamMode: false,
    isFinished: false,
    startTime: null,
    timeLeft: null
  });

  const allGroups = Array.from(new Set(SPECIES_DB.map(s => s.group)));
  
  const [view, setView] = useState<'home' | 'quiz' | 'results' | 'game-select' | 'game-play'>('home');
  const [gameMode, setGameMode] = useState<'flashcard' | 'speed' | 'matching'>('flashcard');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(allGroups);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Tehostettu Prefetching: ladataan kuvat taustalle prioritoiden vaikeita lajeja
  useEffect(() => {
    if (view === 'game-select') {
      const prefetch = async () => {
        // Valitaan lajit learningStoren painotusten mukaan
        const speciesToLoad = SPECIES_DB
          .filter(s => selectedGroups.includes(s.group))
          .sort((a, b) => learningStore.getPriorityWeight(b.name) - learningStore.getPriorityWeight(a.name))
          .slice(0, 20); // Ladataan 20 tärkeintä kuvaa

        // Ladataan rinnakkain pienissä erissä (ei tukita verkkoa)
        const batchSize = 5;
        for (let i = 0; i < speciesToLoad.length; i += batchSize) {
          const batch = speciesToLoad.slice(i, i + batchSize);
          await Promise.all(batch.map(async (s) => {
            try {
              const { imageUrl } = await resolveSpeciesImages(s, 800);
              if (imageUrl) {
                const img = new Image();
                img.src = imageUrl;
              }
            } catch (e) { /* ignore */ }
          }));
        }
      };
      prefetch();
    }
  }, [view, selectedGroups]);

  const startQuiz = (examMode: boolean) => {
    let selectedQuestions: Question[] = [];
    
    if (examMode) {
      const types = [
        { type: QuestionType.IDENTIFICATION, count: 25 },
        { type: QuestionType.REGULATION, count: 15 },
        { type: QuestionType.SAFETY, count: 10 },
        { type: QuestionType.GEAR, count: 5 },
        { type: QuestionType.ETHICS, count: 5 }
      ];

      types.forEach(t => {
        const pool = SAMPLE_QUESTIONS.filter(q => q.type === t.type).sort(() => Math.random() - 0.5);
        selectedQuestions = [...selectedQuestions, ...pool.slice(0, t.count)];
      });

      if (selectedQuestions.length < EXAM_QUESTION_COUNT) {
        const remainingPool = SAMPLE_QUESTIONS.filter(q => !selectedQuestions.includes(q)).sort(() => Math.random() - 0.5);
        selectedQuestions = [...selectedQuestions, ...remainingPool.slice(0, EXAM_QUESTION_COUNT - selectedQuestions.length)];
      }
    } else {
      selectedQuestions = [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5);
    }

    setState({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      userAnswers: new Array(selectedQuestions.length).fill(null),
      isExamMode: examMode,
      isFinished: false,
      startTime: Date.now(),
      timeLeft: examMode ? EXAM_TIME_LIMIT : null
    });
    setView('quiz');
    setShowFeedbackModal(false);
  };

  const startIdentificationGame = (mode: 'flashcard' | 'speed' | 'matching') => {
    if (selectedGroups.length === 0) return;
    setGameMode(mode);
    setView('game-play');
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group) 
        : [...prev, group]
    );
  };

  useEffect(() => {
    let timer: number;
    if (state.isExamMode && state.timeLeft !== null && state.timeLeft > 0 && !state.isFinished) {
      timer = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft !== null ? prev.timeLeft - 1 : null
        }));
      }, 1000);
    } else if (state.timeLeft === 0 && !state.isFinished) {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [state.isExamMode, state.timeLeft, state.isFinished]);

  const selectAnswer = (index: number) => {
    const currentQ = state.questions[state.currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;

    // Äänipalaute harjoittelutilassa
    if (!state.isExamMode) {
      if (isCorrect) uiFeedback.playSuccess();
      else uiFeedback.playError();
      setShowFeedbackModal(true);
    }

    setState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[prev.currentQuestionIndex] = index;
      return { ...prev, userAnswers: newAnswers };
    });
  };

  const nextQuestion = () => {
    setShowFeedbackModal(false);
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const finishQuiz = () => {
    setState(prev => ({ ...prev, isFinished: true }));
    setView('results');
    setShowFeedbackModal(false);
  };

  const calculateResults = (): QuizResults => {
    let score = 0;
    const categoryScores: any = {};

    Object.values(QuestionType).forEach(type => {
      categoryScores[type] = { correct: 0, total: 0 };
    });

    state.questions.forEach((q, i) => {
      categoryScores[q.type].total += 1;
      if (state.userAnswers[i] === q.correctIndex) {
        score += 1;
        categoryScores[q.type].correct += 1;
      }
    });

    return {
      score,
      total: state.questions.length,
      passed: score >= PASS_MARK,
      categoryScores
    };
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          <header className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-emerald-900 tracking-tight">Metsästäjäsimulaattori</h1>
            <p className="text-xl text-stone-600 max-w-lg mx-auto leading-relaxed">
              Opi tunnistamaan yli 200 lajia, hallitsemaan säädökset ja toimimaan turvallisesti maastossa.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <button 
              onClick={() => startQuiz(false)}
              className="bg-white p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Harjoittelutila</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Opiskeluun painottuva tila. Rajaton määrä kysymyksiä ja välitön palaute.
              </p>
            </button>

            <button 
              onClick={() => setView('game-select')}
              className="bg-amber-600 p-6 rounded-3xl shadow-xl border-2 border-transparent hover:bg-amber-700 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-400 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tunnistuspeli</h3>
              <p className="text-xs text-amber-50 leading-relaxed">
                Harjoittele vain lajintunnistusta. Sisältää yli 200 lajin tietokannan.
              </p>
            </button>

            <button 
              onClick={() => startQuiz(true)}
              className="bg-emerald-800 p-6 rounded-3xl shadow-xl border-2 border-transparent hover:bg-emerald-900 transition-all text-left group hover:-translate-y-1 duration-300 shadow-emerald-900/20"
            >
              <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Koesimulaatio</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Realistinen 60 kysymyksen koe. Läpäisyn raja on 45 oikein.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'game-select') {
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex items-center justify-center animate-fade-in">
        <div className="max-w-4xl w-full text-center">
          <button onClick={() => setView('home')} className="mb-8 text-emerald-800 font-bold flex items-center mx-auto hover:underline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Takaisin
          </button>
          <h2 className="text-4xl font-bold text-emerald-900 mb-4 font-serif">Tunnistuspeli</h2>
          <p className="text-stone-600 mb-8">Valitse ensin harjoiteltavat lajiryhmät:</p>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-stone-100 mb-10">
            <h4 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-6">Valitse ryhmät:</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {allGroups.map(group => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 flex items-center space-x-3 ${
                    selectedGroups.includes(group)
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'bg-white border-stone-100 text-stone-400 opacity-60'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedGroups.includes(group) ? 'bg-emerald-600 text-white' : 'bg-stone-200'}`}>
                    {selectedGroups.includes(group) && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                  </div>
                  <span>{group}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <button 
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('flashcard')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 group ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📇</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Kortit</h3>
              <p className="text-xs text-stone-500">Rauhallista kertausta.</p>
            </button>
            <button 
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('speed')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 group ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Pika</h3>
              <p className="text-xs text-stone-500">Nopeus ratkaisee.</p>
            </button>
            <button 
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('matching')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 group ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Yhdistely</h3>
              <p className="text-xs text-stone-500">Yhdistä nimet kuviin.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'game-play') {
    if (gameMode === 'matching') {
      return <MatchingGame selectedGroups={selectedGroups} onExit={() => setView('home')} />;
    }
    return <IdentificationGames mode={gameMode as 'flashcard' | 'speed'} selectedGroups={selectedGroups} onExit={() => setView('home')} />;
  }

  if (view === 'results') {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center animate-fade-in">
        <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100">
          <div className={`p-12 text-center text-white ${results.passed ? 'bg-emerald-600' : 'bg-rose-600'} transition-colors duration-500`}>
            <h2 className="text-5xl font-bold mb-4">{results.passed ? 'Onneksi olkoon!' : 'Lisää harjoittelua kaivataan'}</h2>
            <p className="text-2xl opacity-90 font-medium">Tuloksesi: {results.score} / {results.total}</p>
          </div>
          <div className="p-10 grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">📊 Osaamisalueet</h3>
              <div className="space-y-6">
                {Object.entries(results.categoryScores).map(([category, stats]: [any, any]) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs mb-2 uppercase font-bold text-stone-500 tracking-tighter">
                      <span>{category.replace('_', ' ')}</span>
                      <span>{stats.correct} / {stats.total}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${stats.correct / (stats.total || 1) >= 0.75 ? 'bg-emerald-500' : 'bg-rose-400'}`} style={{ width: `${(stats.correct / (stats.total || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end space-y-3">
              <button onClick={() => startQuiz(state.isExamMode)} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg">Yritä uudelleen</button>
              <button onClick={() => setView('home')} className="w-full py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-all">Palaa pääsivulle</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const progress = ((state.currentQuestionIndex + 1) / (state.questions.length || 1)) * 100;
  const selectedAnswer = state.userAnswers[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {showFeedbackModal && !state.isExamMode && selectedAnswer !== null && currentQuestion && (
        <FeedbackModal
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onNext={nextQuestion}
          onClose={() => setShowFeedbackModal(false)}
          isLast={isLastQuestion}
        />
      )}

      <nav className="bg-emerald-900 text-white p-5 shadow-lg sticky top-0 z-[60]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black tracking-tighter uppercase">Metsästäjäsimulaattori</h2>
            <span className="text-xs bg-emerald-700 px-2 py-1 rounded font-bold">{state.isExamMode ? 'KOE' : 'HARJOITTELU'}</span>
          </div>
          <div className="flex items-center space-x-8">
            {state.timeLeft !== null && (
              <div className="bg-black/20 px-4 py-2 rounded-xl border border-white/10">
                <span className="font-mono text-xl font-bold tabular-nums tracking-tight">{formatTime(state.timeLeft)}</span>
              </div>
            )}
            <button onClick={() => setView('home')} className="text-emerald-100 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Lopeta</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <div className="mb-10 animate-fade-in">
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-3xl font-bold text-emerald-900 tracking-tight">
              {state.currentQuestionIndex + 1} <span className="text-stone-300">/</span> {state.questions.length}
            </h3>
            <span className="text-stone-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-12 border border-stone-100 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-800"></div>
          {currentQuestion && (
            <QuestionDisplay 
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelect={selectAnswer}
              showFeedback={!state.isExamMode && selectedAnswer !== null}
            />
          )}

          <div className="mt-16 flex items-center justify-between pt-10 border-t border-stone-50">
            <button onClick={prevQuestion} disabled={state.currentQuestionIndex === 0} className={`px-8 py-4 rounded-2xl font-bold transition-all ${state.currentQuestionIndex === 0 ? 'text-stone-300' : 'text-stone-600 hover:bg-stone-100'}`}>Edellinen</button>
            <button onClick={nextQuestion} disabled={selectedAnswer === null} className={`px-12 py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${selectedAnswer === null ? 'bg-stone-100 text-stone-400' : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xl'}`}>
              {isLastQuestion ? 'Valmis' : 'Seuraava'}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
