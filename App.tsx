import React, { useEffect, useMemo, useState } from 'react';
import { QuizState, Question, QuestionType, QuizResults, Species } from './types';
import { SAMPLE_QUESTIONS, EXAM_TIME_LIMIT, PASS_MARK, EXAM_QUESTION_COUNT, SPECIES_DB } from './constants';
import QuestionDisplay from './components/QuestionDisplay';
import FeedbackModal from './components/FeedbackModal';
import IdentificationGames from './components/IdentificationGames';
import MatchingGame from './components/MatchingGame';
import { buildIdentificationQuestions } from './services/quizQuestions';
import { resolveSpeciesImages } from './services/commonsImages';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const QUIZ_IMAGE_WIDTH = 1200;
const EXAM_IDENTIFICATION_COUNT = 25;

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

  // Lasketaan ryhmät vain kerran
  const allGroups = useMemo(() => Array.from(new Set(SPECIES_DB.map(s => s.group))), []);
  const [view, setView] = useState<'home' | 'quiz' | 'results' | 'game-select' | 'game-play'>('home');
  const [gameMode, setGameMode] = useState<'flashcard' | 'speed' | 'matching'>('flashcard');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(allGroups);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // Generoidaan lajikysymykset aina SPECIES_DB:stä (ei käsin ylläpitoa)
  const identificationPool = useMemo(() => buildIdentificationQuestions(SPECIES_DB as Species[]), []);

  const hydrateIdentificationImages = async (questions: Question[]): Promise<Question[]> => {
    // Map nimi -> Species nopeaa hakua varten
    const speciesByName = new Map<string, Species>();
    (SPECIES_DB as Species[]).forEach(s => speciesByName.set(s.name, s));

    const out = await Promise.all(
      questions.map(async (q) => {
        if (q.type !== QuestionType.IDENTIFICATION) return q;

        const speciesName = q.options?.[q.correctIndex];
        const species = speciesName ? speciesByName.get(speciesName) : undefined;
        if (!species) return q;

        try {
          const { imageUrl, fallbackImageUrl } = await resolveSpeciesImages(species, QUIZ_IMAGE_WIDTH);
          return {
            ...q,
            imageUrl,
            fallbackImageUrl,
            imageCaption: `${species.group}: ${species.name}`,
          };
        } catch (e) {
          console.warn('resolveSpeciesImages failed in quiz for:', speciesName, e);
          return q;
        }
      })
    );

    return out;
  };

  const buildQuizQuestions = (examMode: boolean): Question[] => {
    const textPool = Array.isArray(SAMPLE_QUESTIONS) ? SAMPLE_QUESTIONS : [];

    if (!examMode) {
      // Harjoittelu: kaikkea sekaisin (tekstit + lajikysymykset)
      return shuffle([...textPool, ...identificationPool]);
    }

    // Koe: 25 tunnistusta + loput tekstipoolista. Jos tekstikysymyksiä ei ole tarpeeksi,
    // täytetään loput tunnistuksilla.
    const picked: Question[] = [];

    const idPick = shuffle(identificationPool).slice(0, Math.min(EXAM_IDENTIFICATION_COUNT, identificationPool.length));
    picked.push(...idPick);

    const remaining = EXAM_QUESTION_COUNT - picked.length;
    const textPick = shuffle(textPool).slice(0, Math.min(remaining, textPool.length));
    picked.push(...textPick);

    if (picked.length < EXAM_QUESTION_COUNT) {
      const need = EXAM_QUESTION_COUNT - picked.length;
      // Lisää vielä tunnistuksia täytteeksi
      const extraId = shuffle(
        identificationPool.filter(q => !picked.some(p => p.id === q.id))
      ).slice(0, need);
      picked.push(...extraId);
    }

    return shuffle(picked).slice(0, EXAM_QUESTION_COUNT);
  };

  const startQuiz = async (examMode: boolean) => {
    setQuizLoading(true);
    try {
      const selectedQuestions = buildQuizQuestions(examMode);
      const hydrated = await hydrateIdentificationImages(selectedQuestions);

      setState({
        questions: hydrated,
        currentQuestionIndex: 0,
        userAnswers: new Array(hydrated.length).fill(null),
        isExamMode: examMode,
        isFinished: false,
        startTime: Date.now(),
        timeLeft: examMode ? EXAM_TIME_LIMIT : null
      });

      setView('quiz');
      setShowFeedbackModal(false);
    } catch (e) {
      console.error('startQuiz failed:', e);
      // fallback: älä kaada UI:ta
      const selectedQuestions = buildQuizQuestions(examMode);
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
    } finally {
      setQuizLoading(false);
    }
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

  const selectAllGroups = () => setSelectedGroups(allGroups);
  const clearAllGroups = () => setSelectedGroups([]);

  useEffect(() => {
    let timer: number | undefined;
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
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isExamMode, state.timeLeft, state.isFinished]);

  const selectAnswer = (index: number) => {
    setState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[prev.currentQuestionIndex] = index;
      return { ...prev, userAnswers: newAnswers };
    });

    if (!state.isExamMode) {
      setShowFeedbackModal(true);
    }
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
      categoryScores[q.type] = categoryScores[q.type] ?? { correct: 0, total: 0 };
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

  if (view === 'quiz' && quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-900"></div>
      </div>
    );
  }

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
              onClick={() => void startQuiz(false)}
              className="bg-white p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Harjoittelutila</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Rajaton määrä kysymyksiä (sis. automaattiset lajikysymykset).
              </p>
            </button>

            <button
              onClick={() => setView('game-select')}
              className="bg-amber-600 p-6 rounded-3xl shadow-xl border-2 border-transparent hover:bg-amber-700 transition-all text-left group hover:-translate-y-1 duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-2">Tunnistuspeli</h3>
              <p className="text-xs text-amber-50 leading-relaxed">
                Kortit / pika / yhdistely.
              </p>
            </button>

            <button
              onClick={() => void startQuiz(true)}
              className="bg-emerald-800 p-6 rounded-3xl shadow-xl border-2 border-transparent hover:bg-emerald-900 transition-all text-left group hover:-translate-y-1 duration-300 shadow-emerald-900/20"
            >
              <h3 className="text-xl font-bold text-white mb-2">Koesimulaatio</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                60 kysymystä aikarajalla (täyttyy aina vaikka SAMPLE_QUESTIONS olisi kesken).
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
            Takaisin
          </button>

          <h2 className="text-4xl font-bold text-emerald-900 mb-4 font-serif">Tunnistuspeli</h2>
          <p className="text-stone-600 mb-8">Valitse ensin harjoiteltavat lajiryhmät:</p>

          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-stone-100 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Suodata lajiryhmät:</h4>
              <div className="space-x-4">
                <button onClick={selectAllGroups} className="text-[10px] font-black text-emerald-700 uppercase hover:underline">Valitse kaikki</button>
                <button onClick={clearAllGroups} className="text-[10px] font-black text-rose-700 uppercase hover:underline">Tyhjennä</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allGroups.map(group => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`px-4 py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                    selectedGroups.includes(group)
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'bg-white border-stone-100 text-stone-400 opacity-60'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {selectedGroups.length === 0 && (
              <p className="mt-4 text-rose-500 text-xs font-bold animate-pulse uppercase tracking-widest text-center">
                Valitse vähintään yksi ryhmä jatkaaksesi
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <button
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('flashcard')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4">📇</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Kortit</h3>
              <p className="text-xs text-stone-500">Rauhallista kertausta.</p>
            </button>

            <button
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('speed')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Pika</h3>
              <p className="text-xs text-stone-500">Nopeus ratkaisee.</p>
            </button>

            <button
              disabled={selectedGroups.length === 0}
              onClick={() => startIdentificationGame('matching')}
              className={`bg-white p-6 rounded-3xl shadow-xl transition-all border border-stone-100 ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Yhdistely</h3>
              <p className="text-xs text-stone-500">Vedä nimet kuviin.</p>
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
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 p-10 text-center">
          <h2 className="text-3xl font-bold mb-2">{results.passed ? 'Onneksi olkoon!' : 'Lisää harjoittelua kaivataan'}</h2>
          <p className="text-lg mb-8">Tuloksesi: {results.score} / {results.total}</p>
          <div className="flex flex-col space-y-3">
            <button onClick={() => void startQuiz(state.isExamMode)} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg">
              Yritä uudelleen
            </button>
            <button onClick={() => setView('home')} className="w-full py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-all">
              Palaa pääsivulle
            </button>
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
              <div className="flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-xl border border-white/10">
                <span className="font-mono text-xl font-bold tabular-nums tracking-tight">{formatTime(state.timeLeft)}</span>
              </div>
            )}
            <button onClick={() => setView('home')} className="text-emerald-100 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
              Lopeta
            </button>
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
            <button
              onClick={prevQuestion}
              disabled={state.currentQuestionIndex === 0}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                state.currentQuestionIndex === 0 ? 'text-stone-300' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Edellinen
            </button>
            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
              className={`px-12 py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
                selectedAnswer === null ? 'bg-stone-100 text-stone-400' : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xl'
              }`}
            >
              {isLastQuestion ? 'Valmis' : 'Seuraava'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
