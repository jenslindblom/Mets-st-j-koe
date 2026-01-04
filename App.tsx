
import React, { useState, useEffect } from 'react';
import { QuizState, Question, QuestionType, QuizResults } from './types';
import { SAMPLE_QUESTIONS, EXAM_TIME_LIMIT, PASS_MARK, EXAM_QUESTION_COUNT, SPECIES_DB } from './constants';
import QuestionDisplay from './components/QuestionDisplay';
import FeedbackModal from './components/FeedbackModal';
import IdentificationGames from './components/IdentificationGames';
import MatchingGame from './components/MatchingGame';
import ProfileSetup from './components/ProfileSetup';
import Leaderboard from './components/Leaderboard';
import { resolveSpeciesImages } from './services/commonsImages';
import { uiFeedback } from './services/uiFeedbackService';
import { learningStore } from './services/learningStore';

const App: React.FC = () => {
  const [data, setData] = useState(learningStore.getData());
  const [view, setView] = useState<'home' | 'quiz' | 'results' | 'game-select' | 'game-play' | 'leaderboard'>('home');
  const [gameMode, setGameMode] = useState<'flashcard' | 'speed' | 'matching'>('flashcard');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
  const [selectedGroups, setSelectedGroups] = useState<string[]>(allGroups);

  useEffect(() => {
    if (view === 'game-select') {
      const prefetch = async () => {
        const speciesToLoad = SPECIES_DB
          .filter(s => selectedGroups.includes(s.group))
          .sort((a, b) => learningStore.getPriorityWeight(b.name) - learningStore.getPriorityWeight(a.name))
          .slice(0, 20);

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
    } else {
      const weightedPool = [...SAMPLE_QUESTIONS].sort((a, b) => {
        return learningStore.getQuizWeight(b.id) - learningStore.getQuizWeight(a.id);
      });
      selectedQuestions = weightedPool.slice(0, 30).sort(() => Math.random() - 0.5);
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

  const handleProfileComplete = (name: string) => {
    setData(learningStore.getData());
  };

  const handleLogout = () => {
    learningStore.logout();
    setData({ profile: null });
    setView('home');
  };

  const selectAnswer = (index: number) => {
    const currentQ = state.questions[state.currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;

    if (!state.isExamMode) {
      if (isCorrect) {
        uiFeedback.playSuccess();
        learningStore.recordQuizSuccess(currentQ.id);
      } else {
        uiFeedback.playError();
        learningStore.recordQuizError(currentQ.id);
      }
      setShowFeedbackModal(true);
    }

    setState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[prev.currentQuestionIndex] = index;
      return { ...prev, userAnswers: newAnswers };
    });
  };

  const finishQuiz = () => {
    const results = calculateResults();
    if (state.isExamMode) {
      learningStore.updateRecord('exam', results.score);
    }
    setData(learningStore.getData());
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
    return { score, total: state.questions.length, passed: score >= PASS_MARK, categoryScores };
  };

  if (!data.profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('home')} />;
  }

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          <header className="space-y-4">
            <div className="flex flex-col items-center space-y-2 mb-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-800 font-bold text-sm">
                <span>Tervetuloa takaisin, <strong>{data.profile.nickname}</strong>!</span>
              </div>
              <button onClick={handleLogout} className="text-xs text-stone-400 font-bold hover:text-emerald-700 uppercase tracking-widest">
                Vaihda käyttäjää
              </button>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-emerald-900 tracking-tight">Metsästäjäsimulaattori</h1>
            <p className="text-xl text-stone-600 max-w-lg mx-auto leading-relaxed">
              Opi tunnistamaan yli 200 lajia ja hallitsemaan metsästyskokeen teoria.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <button 
              onClick={() => startQuiz(false)}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Harjoittelu</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Älykäs tila, joka painottaa vaikeita kysymyksiäsi.</p>
            </button>

            <button 
              onClick={() => setView('game-select')}
              className="bg-amber-600 p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:bg-amber-700 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Tunnistus</h3>
              <p className="text-sm text-amber-50 leading-relaxed">Lajintunnistuspelit kuvilla. Yli 200 lajia.</p>
            </button>

            <button 
              onClick={() => startQuiz(true)}
              className="bg-emerald-800 p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:bg-emerald-900 transition-all text-left group hover:-translate-y-1 duration-300 shadow-emerald-900/20"
            >
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-7 h-7 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Simulaatio</h3>
              <p className="text-sm text-emerald-100 leading-relaxed">Aito koetilanne: 60 kysymystä ja aikaraja.</p>
            </button>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => setView('leaderboard')}
              className="px-10 py-4 bg-white rounded-2xl font-bold text-emerald-800 shadow-lg hover:shadow-xl transition-all flex items-center space-x-3 mx-auto border border-emerald-50"
            >
              <span className="text-2xl">🏆</span>
              <span className="uppercase tracking-widest text-sm font-black">Hall of Fame</span>
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
            <div className="flex flex-wrap justify-center gap-3">
              {allGroups.map(group => (
                <button
                  key={group}
                  onClick={() => setSelectedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group])}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 flex items-center space-x-3 ${
                    selectedGroups.includes(group) ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-white border-stone-100 text-stone-400 opacity-60'
                  }`}
                >
                  <span>{group}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => { setGameMode('flashcard'); setView('game-play'); }} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📇</div>
              <h3 className="text-xl font-bold text-emerald-900">Kortit</h3>
            </button>
            <button onClick={() => { setGameMode('speed'); setView('game-play'); }} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-xl font-bold text-emerald-900">Pika</h3>
            </button>
            <button onClick={() => { setGameMode('matching'); setView('game-play'); }} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
              <h3 className="text-xl font-bold text-emerald-900">Yhdistely</h3>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'game-play') {
    const handleGameExit = (finalScore?: number) => {
      if (finalScore !== undefined) {
        learningStore.updateRecord(gameMode === 'matching' ? 'matching' : 'speed', finalScore);
        setData(learningStore.getData());
      }
      setView('home');
    };

    if (gameMode === 'matching') {
      return <MatchingGame selectedGroups={selectedGroups} onExit={handleGameExit} />;
    }
    return <IdentificationGames mode={gameMode as 'flashcard' | 'speed'} selectedGroups={selectedGroups} onExit={handleGameExit} />;
  }

  if (view === 'results') {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center animate-fade-in">
        <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100">
          <div className={`p-12 text-center text-white ${results.passed ? 'bg-emerald-600' : 'bg-rose-600'} transition-colors duration-500`}>
            <h2 className="text-5xl font-bold mb-4">{results.passed ? 'Onneksi olkoon!' : 'Lisää harjoittelua kaivataan'}</h2>
            <p className="text-2xl opacity-90 font-medium font-serif">Tuloksesi: {results.score} / {results.total}</p>
          </div>
          <div className="p-10 flex flex-col items-center space-y-4">
             <button onClick={() => setView('leaderboard')} className="text-emerald-700 font-bold hover:underline">Katso Hall of Fame</button>
             <button onClick={() => setView('home')} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg max-w-sm text-center">Palaa pääsivulle</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const selectedAnswer = state.userAnswers[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {showFeedbackModal && !state.isExamMode && selectedAnswer !== null && currentQuestion && (
        <FeedbackModal
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onNext={() => {
            setShowFeedbackModal(false);
            if (isLastQuestion) {
              finishQuiz();
            } else {
              setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
            }
          }}
          onClose={() => setShowFeedbackModal(false)}
          isLast={isLastQuestion}
        />
      )}
      <nav className="bg-emerald-900 text-white p-5 shadow-lg sticky top-0 z-[60]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
           <h2 className="text-xl font-black tracking-tighter uppercase">Metsästäjäsimulaattori</h2>
           <button onClick={() => setView('home')} className="text-emerald-100 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Lopeta</button>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl w-auto mx-auto p-4 md:p-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-12 border border-stone-100 relative overflow-hidden animate-slide-up">
          {currentQuestion && (
            <QuestionDisplay 
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelect={selectAnswer}
              showFeedback={!state.isExamMode && selectedAnswer !== null}
            />
          )}
          <div className="mt-16 flex items-center justify-between pt-10 border-t border-stone-50">
            <button onClick={() => setState(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex - 1}))} disabled={state.currentQuestionIndex === 0} className="px-8 py-4 text-stone-600 disabled:opacity-30">Edellinen</button>
            <button onClick={() => isLastQuestion ? finishQuiz() : setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))} disabled={selectedAnswer === null} className="px-12 py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-xl">
              {isLastQuestion ? 'Valmis' : 'Seuraava'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
