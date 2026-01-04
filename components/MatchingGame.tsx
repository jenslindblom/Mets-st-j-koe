
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPECIES_DB } from '../constants';
import SafeImage from './SafeImage';
import { resolveSpeciesImages } from '../services/commonsImages';
import { learningStore } from '../services/learningStore';
import { uiFeedback } from '../services/uiFeedbackService';

interface Props {
  selectedGroups: string[];
  onExit: (finalScore?: number) => void;
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
const MAX_ERRORS = 3;

const MatchingGame: React.FC<Props> = ({ selectedGroups, onExit }) => {
  const [pairs, setPairs] = useState<MatchingPair[]>([]);
  const [shuffledNames, setShuffledNames] = useState<MatchingPair[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [successFlash, setSuccessFlash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const loadSeqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadNewSet = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    setLoading(true);

    const filtered = SPECIES_DB.filter(s => selectedGroups.includes(s.group));
    if (filtered.length === 0) {
      if (!mountedRef.current || seq !== loadSeqRef.current) return;
      setLoading(false);
      return;
    }

    // PARANNETTU: Sekoitetaan peruslista ensin
    const randomizedBase = [...filtered].sort(() => Math.random() - 0.5);

    // Sitten järjestetään painotusten mukaan
    const weighted = randomizedBase.sort((a, b) => {
      const weightA = learningStore.getPriorityWeight(a.name) + (Math.random() * 0.2);
      const weightB = learningStore.getPriorityWeight(b.name) + (Math.random() * 0.2);
      return weightB - weightA;
    });

    const count = Math.min(PAIRS_PER_ROUND, weighted.length);
    const randomSet = weighted.slice(0, count).sort(() => Math.random() - 0.5);

    const resolved = await Promise.all(
      randomSet.map(s => resolveSpeciesImages(s, IMAGE_WIDTH).catch(() => ({})))
    );

    if (!mountedRef.current || seq !== loadSeqRef.current) return;

    const mapped: MatchingPair[] = randomSet.map((s, idx) => ({
      id: s.name,
      name: s.name,
      en: s.en,
      group: s.group,
      imageUrl: (resolved[idx] as any)?.imageUrl,
      fallbackImageUrl: (resolved[idx] as any)?.fallbackImageUrl,
      info: s.info
    }));

    setPairs(mapped);
    setShuffledNames([...mapped].sort(() => Math.random() - 0.5));
    setMatches(new Set());
    setSelectedNameId(null);
    setSelectedImageId(null);
    setLoading(false);
  }, [selectedGroups]);

  useEffect(() => { loadNewSet(); }, [loadNewSet]);

  const checkMatch = (nameId: string | null, imageId: string | null) => {
    if (!nameId || !imageId) return;
    if (nameId === imageId) {
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
      uiFeedback.playError();
      setWrongFlash(nameId);
      learningStore.recordError(nameId);
      
      const newErrors = errors + 1;
      setErrors(newErrors);
      
      if (newErrors >= MAX_ERRORS) {
        setTimeout(() => setIsGameOver(true), 600);
      }

      setTimeout(() => {
        setWrongFlash(null);
        setSelectedNameId(null);
        setSelectedImageId(null);
      }, 500);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-900"></div>
    </div>
  );

  if (isGameOver) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-scale-up">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2 font-serif">Peli päättyi!</h2>
        <p className="text-stone-500 mb-6">Teit 3 virhettä. Lajitunnistus vaatii tarkkuutta!</p>
        <div className="bg-stone-50 p-6 rounded-2xl mb-8">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Pisteet</p>
          <p className="text-5xl font-black text-emerald-900">{score}</p>
        </div>
        <button onClick={() => onExit(score)} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg">Lopeta</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col p-4 md:p-8 animate-fade-in select-none">
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => onExit(score)} className="text-stone-400 hover:text-stone-600 font-bold flex items-center uppercase text-xs tracking-widest">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Lopeta
          </button>

          <div className="flex items-center space-x-6">
            <div className={`px-4 py-1 rounded-full font-bold text-xs flex items-center space-x-2 border ${errors > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
              <span>Virheet:</span>
              <span className="font-black text-sm">{errors} / {MAX_ERRORS}</span>
            </div>
            <div className="px-6 py-2 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg">
              {score} <span className="text-emerald-400 text-xs uppercase tracking-widest ml-1">PISTETTÄ</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-serif">Yhdistä lajit</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 flex-1">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {shuffledNames.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  if (matches.has(p.id) || wrongFlash === p.id) return;
                  setSelectedNameId(p.id);
                  checkMatch(p.id, selectedImageId);
                }}
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-fit">
            {pairs.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  if (matches.has(p.id)) return;
                  setSelectedImageId(p.id);
                  checkMatch(selectedNameId, p.id);
                }}
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
    </div>
  );
};

export default MatchingGame;
