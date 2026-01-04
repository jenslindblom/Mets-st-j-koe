
import React, { useState, useEffect } from 'react';
import { QuizState, Question, QuestionType, QuizResults } from './types';
import { SAMPLE_QUESTIONS, EXAM_TIME_LIMIT, PASS_MARK, SPECIES_DB } from './constants';
import QuestionDisplay from './components/QuestionDisplay';
import FeedbackModal from './components/FeedbackModal';
import IdentificationGames from './components/IdentificationGames';
import MatchingGame from './components/MatchingGame';
import ProfileSetup from './components/ProfileSetup';
import ProfileView from './components/ProfileView';
import Leaderboard from './components/Leaderboard';
import { resolveSpeciesImages } from './services/commonsImages';
import { uiFeedback } from './services/uiFeedbackService';
import { learningStore } from './services/learningStore';

const App: React.FC = () => {
  const [data, setData] = useState(learningStore.getData());
  const [view, setView] = useState<'home' | 'quiz' | 'results' | 'game-select' | 'game-play' | 'leaderboard' | 'profile'>('home');
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
      const speciesToLoad = SPECIES_DB
        .filter(s => selectedGroups.includes(s.group))
        .sort((a, b) => learningStore.getPriorityWeight(b.name) - learningStore.getPriorityWeight(a.name))
        .slice(0, 15);

      speciesToLoad.forEach(s => {
        resolveSpeciesImages(s, 600).then(res => {
          if (res.imageUrl) {
            const img = new Image();
            img.src = res.imageUrl;
          }
        }).catch(() => {});
      });
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
      const weightedPool = [...SAMPLE_QUESTIONS].sort((a, b) => learningStore.getQuizWeight(b.id) - learningStore.getQuizWeight(a.id));
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

  const calculateResults = (): QuizResults => {
    let score = 0;
    const categoryScores: any = {};
    Object.values(QuestionType).forEach(type => categoryScores[type] = { correct: 0, total: 0 });
    state.questions.forEach((q, i) => {
      categoryScores[q.type].total += 1;
      if (state.userAnswers[i] === q.correctIndex) {
        score += 1;
        categoryScores[q.type].correct += 1;
      }
    });
    return { score, total: state.questions.length, passed: score >= PASS_MARK, categoryScores };
  };

  const selectAnswer = (index: number) => {
    setState(prev => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[prev.currentQuestionIndex] = index;
      
      const question = prev.questions[prev.currentQuestionIndex];
      if (index === question.correctIndex) {
        learningStore.recordQuizSuccess(question.id);
      } else {
        learningStore.recordQuizError(question.id);
      }
      
      return { ...prev, userAnswers: newUserAnswers };
    });

    if (!state.isExamMode) {
      setShowFeedbackModal(true);
    }
  };

  const finishQuiz = () => {
    const results = calculateResults();
    learningStore.updateRecord(state.isExamMode ? 'exam' : 'speed', results.score, results);
    setData(learningStore.getData());
    setView('results');
  };

  const handleLogout = () => {
    learningStore.logout();
    setData({ profile: null });
    setView('home');
  };

  if (!data.profile) return <ProfileSetup onComplete={() => setData(learningStore.getData())} />;
  
  const profile = data.profile; // Varmistettu olemassaolo yllä
  
  // Lasketaan taso-XP:t Tinder-tyylistä palkkia varten
  const currentXP = profile.totalPoints || 0;
  const currentLevel = profile.level || 1;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 100;
  const progressPercent = Math.min(100, Math.max(0, ((currentXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100));

  if (view === 'leaderboard') return <Leaderboard onBack={() => setView('home')} />;
  if (view === 'profile') return <ProfileView profile={profile} onBack={() => setView('home')} onLogout={handleLogout} />;

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-4xl w-full text-center space-y-6 md:space-y-10 animate-fade-in">
          <header className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="inline-flex items-center px-5 py-2.5 bg-emerald-100 rounded-full shadow-sm border border-emerald-200">
                <span className="text-emerald-950 font-black text-sm tracking-tight">
                  Tervehdys, <span className="underline decoration-emerald-500/30 text-emerald-900">{profile.nickname}</span>!
                </span>
              </div>
              
              {/* XP-palkki (Tinder-tyylinen koukku) */}
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  <span>Taso {currentLevel}</span>
                  <span>{currentXP} / {nextLevelXP} XP</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                <button onClick={() => setView('profile')} className="text-[11px] text-emerald-600 font-black hover:text-emerald-800 uppercase tracking-[0.2em] transition-colors">
                  Minun profiili
                </button>
                <button onClick={handleLogout} className="text-[11px] text-rose-500 font-black hover:text-rose-700 uppercase tracking-[0.2em] transition-colors">
                  Kirjaudu ulos
                </button>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-emerald-900 tracking-tighter leading-[0.9] text-balance">
              Metsästäjä<br className="hidden sm:block" />simulaattori
            </h1>
            <p className="text-lg sm:text-2xl text-stone-600 max-w-xl mx-auto leading-relaxed px-4 font-medium">
              Varmista metsästyskokeen läpäisy älykkäällä harjoittelulla.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mt-12 px-2">
            <button onClick={() => startQuiz(false)} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all text-left group hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform"><svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">Harjoittelu</h3>
              <p className="text-sm text-stone-400 font-medium">Keskittyy automaattisesti vaikeisiin kohtiisi.</p>
            </button>
            <button onClick={() => setView('game-select')} className="bg-amber-600 p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:bg-amber-700 transition-all text-left group hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
              <h3 className="text-2xl font-black text-white mb-2">Tunnistus</h3>
              <p className="text-sm text-amber-100/80 font-medium">Lajintunnistus kuvilla. Yli 200 riistalajia.</p>
            </button>
            <button onClick={() => startQuiz(true)} className="bg-emerald-800 p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:bg-emerald-900 transition-all text-left group hover:-translate-y-2 duration-300 shadow-emerald-900/20">
              <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform"><svg className="w-8 h-8 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h3 className="text-2xl font-black text-white mb-2">Simulaatio</h3>
              <p className="text-sm text-emerald-100/80 font-medium">Aito 60 kysymyksen koetilanne aikarajalla.</p>
            </button>
          </div>

          <div className="pt-12">
            <button onClick={() => setView('leaderboard')} className="px-10 py-5 bg-white rounded-3xl font-black text-emerald-800 shadow-lg hover:shadow-2xl transition-all flex items-center space-x-4 mx-auto border border-emerald-50 active:scale-95">
              <span className="text-3xl">🏆</span>
              <span className="uppercase tracking-[0.2em] text-xs">Hall of Fame</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Muut näkymät jatkuvat ennallaan...
  if (view === 'game-select') {
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex items-center justify-center animate-fade-in">
        <div className="max-w-4xl w-full text-center">
          <button onClick={() => setView('home')} className="mb-12 text-emerald-800 font-black flex items-center mx-auto hover:underline uppercase text-[10px] tracking-widest">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            Takaisin
          </button>
          <h2 className="text-4xl md:text-6xl font-black text-emerald-900 mb-6 tracking-tight">Tunnistuspelit</h2>
          <p className="text-stone-500 mb-10 font-medium">Valitse harjoiteltavat lajiryhmät:</p>
          <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-stone-100 mb-12"><div className="flex flex-wrap justify-center gap-3">{allGroups.map(group => <button key={group} onClick={() => setSelectedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group])} className={`px-5 py-3 rounded-2xl font-black transition-all border-2 text-xs uppercase tracking-widest ${selectedGroups.includes(group) ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-md' : 'bg-white border-stone-100 text-stone-300 opacity-60'}`}><span>{group}</span></button>)}</div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => { setGameMode('flashcard'); setView('game-play'); }} className="bg-white p-10 rounded-[3rem] shadow-lg hover:shadow-2xl transition-all group border-b-8 border-emerald-600"><div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">📇</div><h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest">Kortit</h3></button>
            <button onClick={() => { setGameMode('speed'); setView('game-play'); }} className="bg-white p-10 rounded-[3rem] shadow-lg hover:shadow-2xl transition-all group border-b-8 border-amber-500"><div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">⚡</div><h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest">Pika</h3></button>
            <button onClick={() => { setGameMode('matching'); setView('game-play'); }} className="bg-white p-10 rounded-[3rem] shadow-lg hover:shadow-2xl transition-all group border-b-8 border-blue-500"><div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">🧩</div><h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest">Yhdistely</h3></button>
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
    if (gameMode === 'matching') return <MatchingGame selectedGroups={selectedGroups} onExit={handleGameExit} />;
    return <IdentificationGames mode={gameMode as 'flashcard' | 'speed'} selectedGroups={selectedGroups} onExit={handleGameExit} />;
  }

  if (view === 'results') {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center animate-fade-in">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
          <div className={`p-10 md:p-16 text-center text-white ${results.passed ? 'bg-emerald-600' : 'bg-rose-600'} transition-colors duration-500`}><h2 className="text-4xl md:text-6xl font-black mb-4">{results.passed ? 'Läpäisty!' : 'Hylätty'}</h2><p className="text-2xl opacity-90 font-black">Pisteesi: {results.score} / {results.total}</p></div>
          <div className="p-12 flex flex-col items-center space-y-6"><button onClick={() => setView('leaderboard')} className="text-emerald-700 font-black uppercase tracking-widest text-sm hover:underline">Katso Hall of Fame</button><button onClick={() => setView('home')} className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-black shadow-xl max-w-sm text-center active:scale-95 transition-transform">Palaa pääsivulle</button></div>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const selectedAnswer = state.userAnswers[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {showFeedbackModal && !state.isExamMode && selectedAnswer !== null && currentQuestion && <FeedbackModal question={currentQuestion} selectedAnswer={selectedAnswer} onNext={() => { setShowFeedbackModal(false); if (isLastQuestion) finishQuiz(); else setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 })); }} onClose={() => setShowFeedbackModal(false)} isLast={isLastQuestion} />}
      <nav className="bg-emerald-950 text-white p-5 shadow-2xl sticky top-0 z-[60] border-b border-emerald-900/50"><div className="max-w-6xl mx-auto flex items-center justify-between"><h2 className="text-sm font-black tracking-[0.3em] uppercase">Metsästäjäsimulaattori</h2><button onClick={() => setView('home')} className="text-emerald-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors border border-emerald-800 px-4 py-2 rounded-full">Lopeta</button></div></nav>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-10"><div className="bg-white rounded-[3rem] shadow-2xl p-6 md:p-14 border border-stone-100 relative overflow-hidden animate-slide-up">{currentQuestion && <QuestionDisplay question={currentQuestion} selectedAnswer={selectedAnswer} onSelect={selectAnswer} showFeedback={!state.isExamMode && selectedAnswer !== null} />}<div className="mt-14 flex items-center justify-between pt-10 border-t border-stone-50"><button onClick={() => setState(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex - 1}))} disabled={state.currentQuestionIndex === 0} className="px-6 py-3 text-stone-300 disabled:opacity-30 font-black uppercase tracking-widest text-[10px]">Edellinen</button><button onClick={() => isLastQuestion ? finishQuiz() : setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))} disabled={selectedAnswer === null} className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest">{isLastQuestion ? 'Valmis' : 'Seuraava'}</button></div></div></main>
    </div>
  );
};

export default App;
