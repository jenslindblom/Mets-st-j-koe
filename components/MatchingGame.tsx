
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
  imageUrl?: string;
  fallbackImageUrl?: string;
}

const PAIRS_PER_ROUND = 6;
const MAX_ERRORS = 3;

const MatchingGame: React.FC<Props> = ({ selectedGroups, onExit }) => {
  const [pairs, setPairs] = useState<MatchingPair[]>([]);
  const [shuffledNames, setShuffledNames] = useState<MatchingPair[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
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
      setLoading(false);
      return;
    }

    const randomized = [...filtered].sort(() => Math.random() - 0.5);
    const weighted = randomized.sort((a, b) => learningStore.getPriorityWeight(b.name) - learningStore.getPriorityWeight(a.name));
    const count = Math.min(PAIRS_PER_ROUND, weighted.length);
    const selected = weighted.slice(0, count).sort(() => Math.random() - 0.5);

    // KÄYNNISTETÄÄN PELI HETI ILMAN KUVIA
    const initialPairs: MatchingPair[] = selected.map(s => ({ id: s.name, name: s.name }));
    setPairs(initialPairs);
    setShuffledNames([...initialPairs].sort(() => Math.random() - 0.5));
    setMatches(new Set());
    setSelectedNameId(null);
    setSelectedImageId(null);
    setLoading(false);

    // HAETAAN KUVAT TAUSTALLA
    selected.forEach((s, idx) => {
      resolveSpeciesImages(s, 600).then(res => {
        if (!mountedRef.current || seq !== loadSeqRef.current) return;
        setPairs(prev => {
          const next = [...prev];
          if (next[idx]) {
            next[idx] = { ...next[idx], imageUrl: res.imageUrl, fallbackImageUrl: res.fallbackImageUrl };
          }
          return next;
        });
      });
    });
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
      setSelectedNameId(null);
      setSelectedImageId(null);
      learningStore.recordSuccess(nameId);
      if (nextMatches.size === pairs.length) {
        setTimeout(loadNewSet, 800);
      }
    } else {
      uiFeedback.playError();
      setWrongFlash(nameId);
      learningStore.recordError(nameId);
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= MAX_ERRORS) {
        setTimeout(() => setIsGameOver(true), 500);
      }
      setTimeout(() => { setWrongFlash(null); setSelectedNameId(null); setSelectedImageId(null); }, 400);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-900"></div></div>;

  if (isGameOver) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-scale-up">
        <h2 className="text-3xl font-black text-emerald-900 mb-6">Peli päättyi</h2>
        <div className="bg-stone-50 p-8 rounded-[2rem] mb-8"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Pisteet</p><p className="text-5xl font-black text-emerald-900">{score}</p></div>
        <button onClick={() => onExit(score)} className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs">Lopeta</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col p-4 md:p-8 animate-fade-in select-none">
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => onExit(score)} className="text-stone-400 hover:text-emerald-800 font-black uppercase text-[10px] tracking-widest flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>Lopeta</button>
          <div className="flex items-center space-x-6">
            <div className="px-4 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">Virheet: {errors} / 3</div>
            <div className="px-8 py-3 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg">{score} <span className="text-emerald-400 text-[10px] uppercase tracking-widest ml-1 font-bold">XP</span></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 h-fit">
            {shuffledNames.map(p => (
              <button key={p.id} onClick={() => { if (matches.has(p.id) || wrongFlash === p.id) return; setSelectedNameId(p.id); checkMatch(p.id, selectedImageId); }} className={`p-5 rounded-2xl font-black text-xs md:text-lg uppercase tracking-widest border-2 transition-all active:scale-95 ${matches.has(p.id) ? 'bg-stone-100 border-stone-100 text-stone-200 opacity-40' : selectedNameId === p.id ? 'bg-emerald-600 border-emerald-700 text-white shadow-xl' : wrongFlash === p.id ? 'bg-rose-500 border-rose-600 text-white animate-shake' : 'bg-white border-white hover:border-emerald-300 text-emerald-900 shadow-sm'}`}>{p.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-fit">
            {pairs.map(p => (
              <button key={p.id} onClick={() => { if (matches.has(p.id)) return; setSelectedImageId(p.id); checkMatch(selectedNameId, p.id); }} className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all duration-300 active:scale-95 ${matches.has(p.id) ? 'border-emerald-500 opacity-30 scale-95' : selectedImageId === p.id ? 'border-emerald-600 shadow-2xl scale-105 z-10' : 'border-white shadow-lg'}`}><SafeImage src={p.imageUrl} fallback={p.fallbackImageUrl} alt={p.name} className="w-full h-full" />{matches.has(p.id) && <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg></div>}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;
