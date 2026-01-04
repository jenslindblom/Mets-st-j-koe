
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

  const filteredSpecies: Species[] = useMemo(() => {
    const base = SPECIES_DB.filter(s => selectedGroups.includes(s.group));
    const randomizedBase = [...base].sort(() => Math.random() - 0.5);
    return randomizedBase.sort((a, b) => {
      const weightA = learningStore.getPriorityWeight(a.name) + (Math.random() * 0.5);
      const weightB = learningStore.getPriorityWeight(b.name) + (Math.random() * 0.5);
      return weightB - weightA;
    });
  }, [selectedGroups]);

  useEffect(() => {
    const seq = ++seqRef.current;
    if (filteredSpecies.length === 0) {
      setLoading(false);
      return;
    }

    const sessionSize = Math.min(20, filteredSpecies.length);
    const sessionPool = filteredSpecies.slice(0, sessionSize);

    const generated: Question[] = sessionPool.map((s, idx) => {
      const distractors = SPECIES_DB
        .filter(x => x.name !== s.name && x.group === s.group)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.name);

      const options = [s.name, ...distractors].sort(() => Math.random() - 0.5);
      if (options.length < 4) {
        const extra = SPECIES_DB.filter(x => !options.includes(x.name)).sort(() => Math.random() - 0.5).slice(0, 4 - options.length).map(x => x.name);
        options.push(...extra);
      }

      return {
        id: `game-${idx}`,
        type: QuestionType.IDENTIFICATION,
        difficulty: Difficulty.NORMAL,
        question: 'Mikä eläin on kyseessä?',
        options,
        correctIndex: options.indexOf(s.name),
        explanation: s.info,
        imageCaption: s.name,
      };
    });

    setQuestions(generated);
    setSpeedAnswers(new Array(generated.length).fill(null));
    setLoading(false);

    sessionPool.forEach((s, idx) => {
      resolveSpeciesImages(s, 800).then(imgRes => {
        if (!mountedRef.current || seq !== seqRef.current) return;
        setQuestions(prev => {
          const next = [...prev];
          if (next[idx]) {
            next[idx] = { ...next[idx], imageUrl: imgRes.imageUrl, fallbackImageUrl: imgRes.fallbackImageUrl, imageCaption: s.group };
          }
          return next;
        });
      });
    });
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
        }, 400);
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
    const groupName = currentQ.imageCaption || 'Muut';
    const isCorrect = index === currentQ.correctIndex;
    
    const nextAnswers = [...speedAnswers];
    nextAnswers[currentIndex] = index;
    setSpeedAnswers(nextAnswers);

    if (isCorrect) {
      uiFeedback.playSuccess();
      setScore(prev => prev + 1);
      learningStore.recordSuccess(correctName, groupName);
      setTimeout(handleNext, 800);
    } else {
      uiFeedback.playError();
      learningStore.recordError(correctName, groupName);
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= MAX_ERRORS) {
        setTimeout(() => setIsGameOver(true), 800);
      } else {
        setTimeout(handleNext, 800);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-900"></div></div>;

  if (isGameOver) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-scale-up">
        <h2 className="text-3xl font-black text-emerald-900 mb-2">{gameOverReason === 'errors' ? 'Peli päättyi' : 'Hyvää työtä!'}</h2>
        <div className="bg-stone-50 p-8 rounded-[2rem] my-8"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Pisteet</p><p className="text-6xl font-black text-emerald-900">{score} / {questions.length}</p></div>
        <button onClick={() => onExit(mode === 'speed' ? score * 10 : score * 5)} className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs">Lopeta</button>
      </div>
    </div>
  );

  const current = questions[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl w-full flex flex-col flex-1">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => onExit()} className="text-stone-400 hover:text-emerald-800 font-black uppercase text-[10px] tracking-widest flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>Takaisin</button>
          <div className="flex items-center space-x-4">
            {mode === 'speed' && <div className="px-4 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">Virheet: {errors} / 3</div>}
            <div className="px-4 py-1.5 bg-stone-200 rounded-full text-stone-600 font-black text-[10px] tracking-widest">{currentIndex + 1} / {questions.length}</div>
          </div>
        </div>

        {mode === 'flashcard' ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className={`relative w-full aspect-[4/5] max-h-[600px] cursor-pointer perspective-1000 transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}>
              <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white"><SafeImage src={current.imageUrl} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 flex items-end justify-center p-10"><p className="text-white font-black uppercase tracking-[0.2em] text-xs">Napauta kääntääksesi</p></div></div>
              <div className="absolute inset-0 backface-hidden bg-emerald-900 rounded-[2.5rem] shadow-2xl p-10 flex flex-col items-center justify-center text-center rotate-y-180 border-8 border-emerald-800"><h2 className="text-5xl font-black text-white mb-6 tracking-tighter">{current.options[current.correctIndex]}</h2><p className="text-emerald-100/70 text-sm mb-12 italic leading-relaxed">{current.explanation}</p><button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="px-12 py-5 bg-white text-emerald-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform">Seuraava</button></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center animate-slide-up">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
              <div className="h-72 md:h-96 relative"><SafeImage src={current.imageUrl} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" />{speedAnswers[currentIndex] !== null && <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}><div className={`p-8 rounded-full shadow-2xl ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-600' : 'bg-rose-600'}`}><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{speedAnswers[currentIndex] === current.correctIndex ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />}</svg></div></div>}</div>
              <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-4">{current.options.map((option, idx) => <button key={idx} onClick={() => handleSpeedAnswer(idx)} disabled={speedAnswers[currentIndex] !== null} className={`p-5 rounded-2xl font-black border-2 transition-all active:scale-95 text-xs uppercase tracking-widest ${speedAnswers[currentIndex] === null ? 'bg-white border-stone-100 hover:border-emerald-500 text-stone-700' : idx === current.correctIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-inner' : idx === speedAnswers[currentIndex] ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-inner' : 'bg-white border-stone-50 text-stone-200 opacity-40'}`}>{option}</button>)}</div>
            </div>
          </div>
        )}
      </div>
      <style>{`.perspective-1000 { perspective: 1000px; } .preserve-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
};

export default IdentificationGames;
