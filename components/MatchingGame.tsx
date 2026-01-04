
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPECIES_DB } from '../constants';
import SafeImage from './SafeImage';
import { resolveSpeciesImages } from '../services/commonsImages';
import { learningStore } from '../services/learningStore';
import { uiFeedback } from '../services/uiFeedbackService';

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
  info: string;
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

  // Click-to-Select tilat
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

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
      setLoading(false);
      return;
    }

    // Priorisoidaan vaikeita lajeja
    const weighted = [...filtered].sort((a, b) => {
      return learningStore.getPriorityWeight(b.name) - learningStore.getPriorityWeight(a.name);
    });

    const count = Math.min(PAIRS_PER_ROUND, weighted.length);
    // Otetaan top-vaikeita ja muutama satunnainen
    const randomSet = weighted.slice(0, count).sort(() => Math.random() - 0.5);

    const resolved = await Promise.all(
      randomSet.map(s =>
        resolveSpeciesImages(s, IMAGE_WIDTH).catch(() => ({ imageUrl: undefined, fallbackImageUrl: undefined }))
      )
    );

    if (!mountedRef.current || seq !== loadSeqRef.current) return;

    const mapped: MatchingPair[] = randomSet.map((s, idx) => ({
      id: s.name,
      name: s.name,
      en: s.en,
      group: s.group,
      imageUrl: resolved[idx]?.imageUrl,
      fallbackImageUrl: resolved[idx]?.fallbackImageUrl,
      info: s.info
    }));

    setPairs(mapped);
    setShuffledNames([...mapped].sort(() => Math.random() - 0.5));
    setMatches(new Set());
    setSelectedNameId(null);
    setSelectedImageId(null);
    setLoading(false);
  }, [selectedGroups]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleNameClick = (id: string) => {
    if (matches.has(id)) return;
    if (selectedNameId === id) {
      setSelectedNameId(null);
    } else {
      setSelectedNameId(id);
      checkMatch(id, selectedImageId);
    }
  };

  const handleImageClick = (id: string) => {
    if (matches.has(id)) return;
    if (selectedImageId === id) {
      setSelectedImageId(null);
    } else {
      setSelectedImageId(id);
      checkMatch(selectedNameId, id);
    }
  };

  const checkMatch = (nameId: string | null, imageId: string | null) => {
    if (!nameId || !imageId) return;

    if (nameId === imageId) {
      // Osuma!
      uiFeedback.playSuccess();
      const nextMatches = new Set(matches);
      nextMatches.add(nameId);
      setMatches(nextMatches);
      setScore(s => s + 10);
      setSuccessFlash(nameId);
      setSelectedNameId(null);
      setSelectedImageId(null);
      learningStore.recordSuccess(nameId);

      setTimeout(() => setSuccessFlash(null), 600);

      if (nextMatches.size === pairs.length) {
        setTimeout(loadNewSet, 1000);
      }
    } else {
      // Virhe
      uiFeedback.playError();
      setWrongFlash(nameId);
      learningStore.recordError(nameId);
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedNameId(null);
        setSelectedImageId(null);
      }, 500);
    }
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
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="text-stone-400 hover:text-stone-600 font-bold flex items-center uppercase text-xs tracking-widest">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            Lopeta
          </button>
          <div className="px-6 py-2 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg">
            {score} <span className="text-emerald-400 text-xs uppercase tracking-widest ml-1">PISTETTÄ</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-serif">Yhdistä lajit</h2>
          <p className="text-stone-500 text-sm mt-1">Valitse nimi ja sen jälkeen vastaava kuva</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 flex-1">
          {/* Nimet - Mobiilissa ylimpänä helposti valittavissa */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {shuffledNames.map(p => (
              <button
                key={p.id}
                onClick={() => handleNameClick(p.id)}
                className={`p-4 md:p-6 rounded-2xl font-bold text-sm md:text-xl text-center shadow-sm border-2 transition-all active:scale-95
                  ${matches.has(p.id) ? 'bg-stone-100 border-stone-200 text-stone-300 opacity-50 cursor-default' : 
                    selectedNameId === p.id ? 'bg-emerald-600 border-emerald-700 text-white shadow-emerald-200' :
                    wrongFlash === p.id ? 'bg-rose-500 border-rose-600 text-white animate-shake' :
                    'bg-white border-white hover:border-emerald-300 text-emerald-900'}
                `}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Kuvat */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-fit">
            {pairs.map(p => (
              <button
                key={p.id}
                onClick={() => handleImageClick(p.id)}
                className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all duration-300 active:scale-95
                  ${matches.has(p.id) ? 'border-emerald-500 opacity-40 scale-95' : 
                    selectedImageId === p.id ? 'border-emerald-600 shadow-2xl scale-105 z-10' :
                    'border-white shadow-lg hover:shadow-xl'}
                  ${successFlash === p.id ? 'animate-correct-flash' : ''}
                `}
              >
                <SafeImage src={p.imageUrl || ''} fallback={p.fallbackImageUrl} alt={p.name} className="w-full h-full" />
                {matches.has(p.id) && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes correct-flash {
          0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); transform: scale(1); }
          50% { box-shadow: 0 0 40px 10px rgba(16, 185, 129, 0.8); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-correct-flash { animation: correct-flash 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MatchingGame;
