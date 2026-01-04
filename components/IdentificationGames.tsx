
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
  onExit: () => void;
}

const IMAGE_WIDTH = 1200;

const IdentificationGames: React.FC<Props> = ({ mode, selectedGroups, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [speedAnswers, setSpeedAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const seqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const filteredSpecies: Species[] = useMemo(() => {
    const base = SPECIES_DB.filter(s => selectedGroups.includes(s.group));
    // Priorisoidaan vaikeita lajeja sekoituksessa
    return base.sort((a, b) => {
      const weightA = learningStore.getPriorityWeight(a.name) + Math.random() * 5;
      const weightB = learningStore.getPriorityWeight(b.name) + Math.random() * 5;
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

      // Rajoitetaan sessio n. 20 kysymykseen kerrallaan optimaalisen oppimisen vuoksi
      const sessionSize = Math.min(20, filteredSpecies.length);
      const sessionPool = filteredSpecies.slice(0, sessionSize);

      // Fix: provide a typed fallback object to maintain type safety in the resulting array
      const imagePairs = await Promise.all(
        sessionPool.map(s => resolveSpeciesImages(s, IMAGE_WIDTH).catch(() => ({
          imageUrl: undefined as string | undefined,
          fallbackImageUrl: undefined as string | undefined
        })))
      );

      if (!mountedRef.current || seq !== seqRef.current) return;

      const generated: Question[] = sessionPool.map((s, idx) => {
        const distractorsSameGroup = SPECIES_DB
          .filter(x => x.name !== s.name && x.group === s.group)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(x => x.name);

        const distractors: string[] = [...distractorsSameGroup];
        if (distractors.length < 3) {
          const extra = SPECIES_DB
            .filter(x => x.name !== s.name && x.group !== s.group)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3 - distractors.length)
            .map(x => x.name);
          distractors.push(...extra);
        }

        const options = [s.name, ...distractors].sort(() => Math.random() - 0.5);
        // Fix: Destructure from imagePairs[idx] which now is guaranteed to have the correct optional properties
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
        window.setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsTransitioning(false);
        }, 500);
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    } else {
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
    } else {
      uiFeedback.playError();
      learningStore.recordError(correctName);
    }

    const nextAnswers = [...speedAnswers];
    nextAnswers[currentIndex] = index;
    setSpeedAnswers(nextAnswers);
    window.setTimeout(handleNext, 1200);
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
        <button onClick={onExit} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold">Palaa alkuun</button>
      </div>
    </div>
  );

  const current = questions[currentIndex];

  if (isGameOver) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-stone-100">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2 font-serif">Sessio ohi!</h2>
        <p className="text-stone-500 mb-8">Kävit läpi {questions.length} tunnistustehtävää.</p>
        <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
          <p className="text-4xl font-black text-emerald-900">{score} / {questions.length}</p>
          <p className="text-xs font-bold text-emerald-700 uppercase mt-2">Oikein tunnistettu</p>
        </div>
        <button onClick={onExit} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg">Lopeta</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl w-full flex flex-col flex-1">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onExit} className="text-stone-400 hover:text-stone-600 font-bold flex items-center transition-colors uppercase text-xs tracking-widest">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            Lopeta
          </button>
          <div className="px-4 py-1 bg-stone-200 rounded-full text-stone-600 font-bold uppercase tracking-widest text-[10px]">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {mode === 'flashcard' ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div 
              className={`relative w-full aspect-[4/5] max-h-[550px] cursor-pointer perspective-1000 transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => { if(!isTransitioning) setIsFlipped(!isFlipped); }}
            >
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                <SafeImage src={current.imageUrl || ''} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 flex items-end justify-center p-10">
                  <p className="text-white font-bold text-xl text-center">Mikä laji? <span className="block text-sm font-normal opacity-70">Napauta kääntääksesi</span></p>
                </div>
              </div>
              <div className="absolute inset-0 backface-hidden bg-emerald-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center rotate-y-180 border-4 border-emerald-800">
                <h2 className="text-4xl font-bold text-white mb-6 font-serif leading-tight">{current.options[current.correctIndex]}</h2>
                <div className="bg-white/10 p-4 rounded-xl text-emerald-50 text-sm mb-10 italic">{current.explanation}</div>
                <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="px-10 py-4 bg-white text-emerald-900 rounded-full font-bold uppercase tracking-widest shadow-lg">Seuraava</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center animate-slide-up">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200">
              <div className="h-64 md:h-80 relative">
                <SafeImage src={current.imageUrl || ''} fallback={current.fallbackImageUrl} alt="Laji" className="w-full h-full" />
                {speedAnswers[currentIndex] !== null && (
                  <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}>
                    <div className={`p-8 rounded-full shadow-2xl ${speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {speedAnswers[currentIndex] === current.correctIndex ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {current.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSpeedAnswer(idx)} 
                      disabled={speedAnswers[currentIndex] !== null}
                      className={`p-5 rounded-2xl font-bold border-2 transition-all duration-300 ${
                        speedAnswers[currentIndex] === null ? 'bg-white border-stone-100 hover:border-emerald-500 text-stone-700' :
                        idx === current.correctIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                        idx === speedAnswers[currentIndex] ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-stone-50 text-stone-300 opacity-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default IdentificationGames;
