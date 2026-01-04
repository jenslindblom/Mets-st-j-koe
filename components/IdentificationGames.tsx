
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Question, QuestionType, Difficulty, Species } from '../types';
import { SPECIES_DB } from '../constants';
import SafeImage from './SafeImage';
import { resolveSpeciesImages } from '../services/commonsImages';
import { learningStore } from '../services/learningStore';
import { uiFeedback } from '../services/uiFeedbackService';

interface Props {
  mode: 'flashcard' | 'speed';
  selectedGroups: string[];
  onExit: (finalScore?: number) => void;
}

const IMAGE_WIDTH = 1200;
const MAX_ERRORS = 3;

const IdentificationGames: React.FC<Props> = ({ mode, selectedGroups, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [speedAnswers, setSpeedAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'complete' | 'errors'>('complete');
  const [loading, setLoading] = useState(true);

  const seqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // PARANNETTU: Sekoitetaan lista ja vasta sitten järjestetään painotusten mukaan
  const filteredSpecies: Species[] = useMemo(() => {
    const base = SPECIES_DB.filter(s => selectedGroups.includes(s.group));
    
    // 1. Sekoitetaan koko peruslista satunnaisesti
    const randomizedBase = [...base].sort(() => Math.random() - 0.5);
    
    // 2. Järjestetään painotuksen mukaan (vaikeimmat ensin)
    // Lisätään pieni satunnainen kerroin painotukseen, jotta järjestys ei ole liian staattinen
    return randomizedBase.sort((a, b) => {
      const weightA = learningStore.getPriorityWeight(a.name) + (Math.random() * 0.5);
      const weightB = learningStore.getPriorityWeight(b.name) + (Math.random() * 0.5);
      return weightB - weightA;
    });
  }, [selectedGroups]);

  useEffect(() => {
    const seq = ++seqRef.current;
    setLoading(true);
    const run = async () => {
      if (filteredSpecies.length === 0) {
        setLoading(false);
        return;
      }
      // Otetaan nyt sekoitetusta ja painotetusta listasta ensimmäiset 20
      const sessionSize = Math.min(20, filteredSpecies.length);
      const sessionPool = filteredSpecies.slice(0, sessionSize);
      
      const imagePairs = await Promise.all(
        sessionPool.map(s => resolveSpeciesImages(s, IMAGE_WIDTH).catch(() => ({
          imageUrl: undefined as string | undefined,
          fallbackImageUrl: undefined as string | undefined
        })))
      );

      if (!mountedRef.current || seq !== seqRef.current) return;

      const generated: Question[] = sessionPool.map((s, idx) => {
        const distractors = SPECIES_DB
          .filter(x => x.name !== s.name && x.group === s.group)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(x => x.name);

        const options = [s.name, ...distractors].sort(() => Math.random() - 0.5);
        
        if (options.length < 4) {
          const extra = SPECIES_DB
            .filter(x => !options.includes(x.name))
            .sort(() => Math.random() - 0.5)
            .slice(0, 4 - options.length)
            .map(x => x.name);
          options.push(...extra);
        }

        const { imageUrl, fallbackImageUrl } = imagePairs[idx];
        return {
          id: `game-id-${idx}`,
          type: QuestionType.IDENTIFICATION,
          difficulty: Difficulty.NORMAL,
          question: 'Mikä eläin on kyseessä?',
          options,
          correctIndex: options.indexOf(s.name),
          explanation: s.info,
          imageUrl,
          fallbackImageUrl,
          imageCaption: `${s.group}: ${s.name}`,
        };
      });

      setQuestions(generated);
      setSpeedAnswers(new Array(generated.length).fill(null));
      setLoading(false);
    };
    run();
  }, [filteredSpecies]);

  const handleNext = () => {
    if (isTransitioning) return;
    if (currentIndex < questions.length - 1) {
      if (mode === 'flashcard' && isFlipped) {
        setIsTransitioning(true);
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsTransitioning(false);
        }, 500);
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    } else {
      setGameOverReason('complete');
      setIsGameOver(true);
    }
  };

  const handleSpeedAnswer = (index: number) => {
    if (speedAnswers[currentIndex] !== null || isTransitioning) return;
    const currentQ = questions[currentIndex];
    const correctName = currentQ.options[currentQ.correctIndex];
    const isCorrect = index === currentQ.correctIndex;
    
    if (isCorrect) {
      uiFeedback.playSuccess();
      setScore(prev => prev + 1);
      learningStore.recordSuccess(correctName);
      const nextAnswers = [...speedAnswers];
      nextAnswers[currentIndex] = index;
      setSpeedAnswers(nextAnswers);
      setTimeout(handleNext, 1200);
    } else {
      uiFeedback.playError();
      learningStore.recordError(correctName);
      
      const newErrors = errors + 1;
      setErrors(newErrors);
      
      const nextAnswers = [...speedAnswers];
      nextAnswers[currentIndex] = index;
      setSpeedAnswers(nextAnswers);

      if (newErrors >= MAX_ERRORS) {
        setGameOverReason('errors');
        setTimeout(() => setIsGameOver(true), 1200);
      } else {
        setTimeout(handleNext, 1200);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-900"></div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Valitse lajeja harjoitteluun</h2>
        <button onClick={() => onExit()} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold">Takaisin</button>
      </div>
    </div>
  );

  if (isGameOver) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-scale-up">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">{gameOverReason === 'errors' ? '❌' : '🏆'}</span>
        </div>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2 font-serif">
          {gameOverReason === 'errors' ? 'Peli päättyi!' : 'Hienoa työtä!'}
        </h2>
        <p className="text-stone-500 mb-6">
          {gameOverReason === 'errors' ? 'Teit 3 virhettä. Harjoitus tekee mestarin!' : 'Sait kaikki kysymykset vastattua.'}
        </p>
        <div className="bg-stone-50 p-6 rounded-2xl mb-8">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Pisteet</p>
          <p className="text-5xl font-black text-emerald-900">{score} / {questions.length}</p>
        </div>
        <button onClick={() => onExit(mode === 'speed' ? score * 100 : score * 10)} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-900 transition-all">Lopeta</button>
      </div>
    </div>
  );

  const current = questions[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl w-full flex flex-col flex-1">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => onExit()} className="text-stone-400 hover:text-stone-600 font-bold flex items-center uppercase text-xs tracking-widest">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Takaisin
          </button>
          
          <div className="flex items-center space-x-4">
            {mode === 'speed' && (
              <div className={`px-4 py-1 rounded-full font-bold text-xs flex items-center space-x-2 border ${errors > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                <span>Virheet:</span>
                <span className="font-black text-sm">{errors} / {MAX_ERRORS}</span>
              </div>
            )}
            <div className="px-4 py-1 bg-stone-200 rounded-full text-stone-600 font-bold uppercase tracking-widest text-[10px]">{currentIndex + 1} / {questions.length}</div>
          </div>
        </div>

        {mode === 'speed' && currentIndex === 0 && !speedAnswers[0] && (
          <div className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center animate-bounce">
            <p className="text-amber-800 text-sm font-bold">⚠️ Varoitus: Peli päättyy 3 virheen jälkeen!</p>
          </div>
        )}

        {mode === 'flashcard' ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className={`relative w-full aspect-[4/5] max-h-[550px] cursor-pointer perspective-1000 transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}>
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                <SafeImage src={current.imageUrl || ''} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 flex items-end justify-center p-8">
                  <p className="text-white font-bold text-lg">Napauta kääntääksesi</p>
                </div>
              </div>
              <div className="absolute inset-0 backface-hidden bg-emerald-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center rotate-y-180 border-4 border-emerald-800">
                <h2 className="text-4xl font-bold text-white mb-6 font-serif">{current.options[current.correctIndex]}</h2>
                <div className="bg-white/10 p-4 rounded-xl text-emerald-50 text-sm mb-10 italic">{current.explanation}</div>
                <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="px-10 py-4 bg-white text-emerald-900 rounded-full font-bold uppercase tracking-widest">Seuraava</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center animate-slide-up">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200">
              <div className="h-64 md:h-80 relative">
                <SafeImage src={current.imageUrl || ''} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" />
                {speedAnswers[currentIndex] !== null && <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}><div className={`p-8 rounded-full shadow-2xl ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-600' : 'bg-rose-600'}`}><svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{speedAnswers[currentIndex] === current.correctIndex ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />}</svg></div></div>}
              </div>
              <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.map((option, idx) => (
                  <button key={idx} onClick={() => handleSpeedAnswer(idx)} disabled={speedAnswers[currentIndex] !== null} className={`p-5 rounded-2xl font-bold border-2 transition-all active:scale-95 ${speedAnswers[currentIndex] === null ? 'bg-white border-stone-100 hover:border-emerald-500 text-stone-700' : idx === current.correctIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : idx === speedAnswers[currentIndex] ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-stone-50 text-stone-300 opacity-50'}`}>{option}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`.perspective-1000 { perspective: 1000px; } .preserve-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
};

export default IdentificationGames;
