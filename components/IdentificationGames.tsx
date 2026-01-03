// components/IdentificationGames.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Question, QuestionType, Difficulty, Species } from '../types';
import { SPECIES_DB } from '../constants';
import SafeImage from './SafeImage';
import { resolveSpeciesImages } from '../services/commonsImages';

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

  // Prevent stale async results from overwriting newer state
  const seqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const filteredSpecies: Species[] = useMemo(
    () => SPECIES_DB.filter(s => selectedGroups.includes(s.group)),
    [selectedGroups]
  );

  useEffect(() => {
    const seq = ++seqRef.current;

    // Reset session state whenever groups change
    setQuestions([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsTransitioning(false);
    setSpeedAnswers([]);
    setScore(0);
    setIsGameOver(false);
    setLoading(true);

    const run = async () => {
      // No species selected -> end loading and show empty state
      if (filteredSpecies.length === 0) {
        if (!mountedRef.current || seq !== seqRef.current) return;
        setQuestions([]);
        setSpeedAnswers([]);
        setLoading(false);
        return;
      }

      // Pre-fetch images (shared logic). If one fails, continue.
      const imagePairs = await Promise.all(
        filteredSpecies.map(s =>
          resolveSpeciesImages(s, IMAGE_WIDTH).catch(err => {
            console.warn('resolveSpeciesImages failed for', s?.name, err);
            return { imageUrl: undefined, fallbackImageUrl: undefined };
          })
        )
      );

      if (!mountedRef.current || seq !== seqRef.current) return;

      const generated: Question[] = filteredSpecies
        .map((s, idx) => {
          // Distractors: prefer same group, then fill from other groups
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
          const correctIndex = options.indexOf(s.name);

          const { imageUrl, fallbackImageUrl } = imagePairs[idx] ?? {};

          return {
            id: `game-id-${idx}`,
            type: QuestionType.IDENTIFICATION,
            difficulty: Difficulty.NORMAL,
            question: 'Mikä eläin on kyseessä?',
            options,
            correctIndex,
            explanation: s.info,
            imageUrl,
            fallbackImageUrl,
            imageCaption: `${s.group}: ${s.name}`,
          };
        })
        .sort(() => Math.random() - 0.5);

      if (!mountedRef.current || seq !== seqRef.current) return;

      setQuestions(generated);
      setSpeedAnswers(new Array(generated.length).fill(null));
      setLoading(false);
    };

    run().catch(err => {
      console.error(err);
      if (!mountedRef.current || seq !== seqRef.current) return;

      // Fallback: generate questions without images
      const generated: Question[] = filteredSpecies
        .map((s, idx) => {
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

          return {
            id: `game-id-${idx}`,
            type: QuestionType.IDENTIFICATION,
            difficulty: Difficulty.NORMAL,
            question: 'Mikä eläin on kyseessä?',
            options,
            correctIndex: options.indexOf(s.name),
            explanation: s.info,
            imageUrl: undefined,
            fallbackImageUrl: undefined,
            imageCaption: `${s.group}: ${s.name}`,
          };
        })
        .sort(() => Math.random() - 0.5);

      setQuestions(generated);
      setSpeedAnswers(new Array(generated.length).fill(null));
      setLoading(false);
    });
  }, [filteredSpecies]);

  const handleFlip = () => {
    if (mode === 'flashcard' && !isTransitioning) setIsFlipped(v => !v);
  };

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

    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(prev => prev + 1);

    const nextAnswers = [...speedAnswers];
    nextAnswers[currentIndex] = index;
    setSpeedAnswers(nextAnswers);

    window.setTimeout(() => handleNext(), 1200);
  };

  // ---- UI states ----

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-900"></div>
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-stone-100">
          <div className="text-6xl mb-6">🦌</div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2 font-serif">Ei valittuja lajeja</h2>
          <p className="text-stone-500 mb-8">
            Valitse vähintään yksi lajiryhmä ennen kuin aloitat tunnistusharjoituksen.
          </p>
          <button
            onClick={onExit}
            className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg"
          >
            Takaisin
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-stone-100">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold text-emerald-900 mb-2 font-serif">Sessio ohi!</h2>
          <p className="text-stone-500 mb-8">Kävit läpi {questions.length} tunnistustehtävää valituissa ryhmissä.</p>
          {mode === 'speed' && (
            <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-1">Osumatarkkuus</p>
              <p className="text-4xl font-black text-emerald-900">
                {score} / {questions.length}
              </p>
            </div>
          )}
          <button
            onClick={onExit}
            className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg"
          >
            Lopeta harjoitus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl w-full flex flex-col flex-1">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onExit}
            className="text-stone-400 hover:text-stone-600 font-bold flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            LOPETA
          </button>

          <div className="px-4 py-1 bg-stone-200 rounded-full text-stone-600 font-bold uppercase tracking-widest text-[10px]">
            {mode === 'flashcard' ? 'LAJIKORTIT' : 'PIKATUNNISTUS'} • {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {mode === 'flashcard' ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div
              className={`relative w-full aspect-[4/5] max-h-[550px] cursor-pointer perspective-1000 transition-transform duration-500 preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={handleFlip}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                <div className="w-full h-full relative">
                  <SafeImage
                    src={current.imageUrl || ''}
                    fallback={current.fallbackImageUrl}
                    alt="Lajitunnistus"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-10">
                    <p className="text-white font-bold text-xl drop-shadow-lg text-center">
                      Mikä laji?
                      <br />
                      <span className="text-sm font-normal opacity-80">Napauta kääntääksesi</span>
                    </p>
                  </div>

                  {!current.imageUrl && (
                    <div className="absolute top-4 left-4 bg-white/80 text-stone-700 text-xs font-semibold px-3 py-2 rounded-xl">
                      Kuva puuttuu (commonsCategory / images[])
                    </div>
                  )}
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-emerald-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center rotate-y-180 border-4 border-emerald-800">
                <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Laji on:</h3>
                <h2 key={currentIndex} className="text-5xl font-bold text-white mb-8 font-serif leading-tight">
                  {current.options[current.correctIndex]}
                </h2>
                <div className="bg-white/10 p-6 rounded-2xl text-emerald-50 mb-10 max-w-sm border border-white/10 italic">
                  "{current.explanation}"
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={isTransitioning}
                  className={`px-12 py-4 bg-white text-emerald-900 rounded-full font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-xl ${
                    isTransitioning ? 'opacity-50' : 'hover:bg-emerald-50'
                  }`}
                >
                  {isTransitioning ? 'Ladataan...' : 'Seuraava'}
                </button>
              </div>
            </div>

            <p className="mt-8 text-stone-400 text-xs uppercase tracking-widest text-center">
              Tunnista tuntomerkit ennen kuin käännät.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center animate-slide-up">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200">
              <div className="h-64 md:h-80 relative">
                <SafeImage
                  src={current.imageUrl || ''}
                  fallback={current.fallbackImageUrl}
                  alt="Mikä eläin?"
                  className="w-full h-full"
                />

                {!current.imageUrl && (
                  <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-white/80 text-stone-700 text-xs font-semibold">
                      Kuva puuttuu (commonsCategory / images[])
                    </div>
                  </div>
                )}

                {speedAnswers[currentIndex] !== null && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                      speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-500/30' : 'bg-rose-500/30'
                    }`}
                  >
                    <div
                      className={`p-8 rounded-full shadow-2xl scale-110 ${
                        speedAnswers[currentIndex] === current.correctIndex ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {speedAnswers[currentIndex] === current.correctIndex ? (
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center font-serif">Tunnista nopeasti:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {current.options.map((option, idx) => {
                    let btnClass = 'p-5 rounded-2xl font-bold border-2 transition-all duration-300 text-lg ';

                    if (speedAnswers[currentIndex] !== null) {
                      if (idx === current.correctIndex) btnClass += 'bg-emerald-50 border-emerald-500 text-emerald-700 scale-105 z-10 shadow-lg';
                      else if (idx === speedAnswers[currentIndex]) btnClass += 'bg-rose-50 border-rose-500 text-rose-700';
                      else btnClass += 'bg-white border-stone-100 text-stone-300 opacity-50';
                    } else {
                      btnClass += 'bg-white border-stone-100 hover:border-emerald-500 hover:shadow-lg text-stone-700 hover:-translate-y-1';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSpeedAnswer(idx)}
                        className={btnClass}
                        disabled={speedAnswers[currentIndex] !== null || isTransitioning}
                      >
                        {option}
                      </button>
                    );
                  })}
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
