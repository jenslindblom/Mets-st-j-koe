import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPECIES_DB } from '../constants';
import SafeImage from './SafeImage';
import { resolveSpeciesImages } from '../services/commonsImages';

interface Props {
  selectedGroups: string[];
  onExit: () => void;
}

interface MatchingPair {
  id: string;
  name: string;
  en: string;
  group: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
}

const PAIRS_PER_ROUND = 6;
const IMAGE_WIDTH = 800;

const MatchingGame: React.FC<Props> = ({ selectedGroups, onExit }) => {
  const [pairs, setPairs] = useState<MatchingPair[]>([]);
  const [shuffledNames, setShuffledNames] = useState<MatchingPair[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [successFlash, setSuccessFlash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevent race conditions when loading a new set quickly (e.g. fast rounds/unmount)
  const loadSeqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadNewSet = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    setLoading(true);

    const filtered = SPECIES_DB.filter(s => selectedGroups.includes(s.group));

    if (filtered.length === 0) {
      if (!mountedRef.current || seq !== loadSeqRef.current) return;
      setPairs([]);
      setShuffledNames([]);
      setMatches(new Set());
      setSuccessFlash(null);
      setLoading(false);
      return;
    }

    const count = Math.min(PAIRS_PER_ROUND, filtered.length);
    const randomSet = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);

    // Fetch images via the shared Commons logic
    const resolved = await Promise.all(
      randomSet.map(s =>
        resolveSpeciesImages(s, IMAGE_WIDTH).catch(err => {
          console.warn('resolveSpeciesImages failed for', s?.name, err);
          return { imageUrl: undefined, fallbackImageUrl: undefined };
        })
      )
    );

    if (!mountedRef.current || seq !== loadSeqRef.current) return;

    const mapped: MatchingPair[] = randomSet.map((s, idx) => ({
      id: s.name, // assumed unique within a round; if duplicates ever appear, consider id: `${s.name}-${idx}`
      name: s.name,
      en: s.en,
      group: s.group,
      imageUrl: resolved[idx]?.imageUrl,
      fallbackImageUrl: resolved[idx]?.fallbackImageUrl,
    }));

    setPairs(mapped);
    setShuffledNames([...mapped].sort(() => Math.random() - 0.5));
    setMatches(new Set());
    setSuccessFlash(null);
    setLoading(false);
  }, [selectedGroups]);

  useEffect(() => {
    loadNewSet().catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [loadNewSet]);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('speciesId', id);
    // Helps some browsers show proper drag cursor
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('speciesId');

    if (!draggedId || draggedId !== targetId) return;

    setMatches(prev => {
      if (prev.has(targetId)) return prev; // already matched, ignore

      const next = new Set(prev);
      next.add(targetId);

      // Flash + points
      setScore(s => s + 10);
      setSuccessFlash(targetId);
      window.setTimeout(() => setSuccessFlash(null), 600);

      // If all matched, load next set
      if (next.size === pairs.length && pairs.length > 0) {
        window.setTimeout(() => {
          loadNewSet().catch(console.error);
        }, 800);
      }

      return next;
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col p-4 md:p-8 animate-fade-in select-none">
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1">
        {/* Header */}
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

          <div className="flex items-center space-x-6">
            <div className="px-6 py-2 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg">
              {score}{' '}
              <span className="text-emerald-400 text-xs uppercase tracking-widest ml-1">
                PISTETTÄ
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-emerald-900 font-serif">Yhdistä nimi kuvaan</h2>
          <p className="text-stone-500 text-sm mt-2 font-medium">Vedä lajinimi oikean kuvan päälle</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 items-start">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {pairs.map(p => (
              <div
                key={p.id}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, p.id)}
                className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all duration-300
                  ${matches.has(p.id) ? 'opacity-30 border-emerald-500 scale-95 grayscale' : 'border-white shadow-xl'}
                  ${successFlash === p.id ? 'animate-correct-flash' : ''}
                `}
              >
                <SafeImage
                  src={p.imageUrl || ''}
                  fallback={p.fallbackImageUrl}
                  alt={p.name}
                  className="w-full h-full"
                />

                {/* If no image resolved, show a subtle overlay (optional but useful) */}
                {!p.imageUrl && (
                  <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-white/80 text-stone-700 text-xs font-semibold">
                      Kuva puuttuu (lisää commonsCategory tai images[] override)
                    </div>
                  </div>
                )}

                {matches.has(p.id) && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-600 p-3 rounded-full shadow-2xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-4">
            {shuffledNames.map(p => (
              <div
                key={p.id}
                draggable={!matches.has(p.id)}
                onDragStart={(e) => onDragStart(e, p.id)}
                className={`p-6 rounded-2xl font-bold text-xl text-center shadow-md border-2 transition-all cursor-grab active:cursor-grabbing
                  ${matches.has(p.id)
                    ? 'bg-stone-100 border-stone-200 text-stone-300 pointer-events-none'
                    : 'bg-white border-white hover:border-emerald-500 hover:shadow-xl text-emerald-900 hover:-translate-y-1'
                  }
                `}
              >
                {p.name}
              </div>
            ))}

            <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50 flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <p className="text-emerald-800 text-sm italic">
                Saat 10 pistettä jokaisesta oikeasta parista. Peli uusiutuu automaattisesti kun kaikki on yhdistetty!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes correct-flash {
          0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); transform: scale(1); }
          50% { box-shadow: 0 0 40px 10px rgba(16, 185, 129, 0.8); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); transform: scale(1); }
        }
        .animate-correct-flash {
          animation: correct-flash 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MatchingGame;
