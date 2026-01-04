
import React, { useState, useMemo } from 'react';
import { SPECIES_DB } from '../constants';
import { learningStore } from '../services/learningStore';
import { curationService } from '../services/curationService';
import SafeImage from './SafeImage';

interface Props {
  onBack: () => void;
}

const Encyclopedia: React.FC<Props> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Kaikki');

  const groups = useMemo(() => ['Kaikki', ...Array.from(new Set(SPECIES_DB.map(s => s.group)))], []);

  const filteredSpecies = useMemo(() => {
    return SPECIES_DB.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.latin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'Kaikki' || s.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup]);

  // Lasketaan kokoelman edistyminen
  const collectionStats = useMemo(() => {
    const total = SPECIES_DB.length;
    const unlocked = SPECIES_DB.filter(s => learningStore.getSpeciesStats(s.name).success > 0).length;
    const mastered = SPECIES_DB.filter(s => learningStore.getSpeciesStats(s.name).success >= 5).length;
    return { total, unlocked, mastered, percent: Math.round((unlocked / total) * 100) };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col animate-fade-in">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-black text-emerald-900 uppercase tracking-tight">Lajikirja</h1>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Keräilytilanne: {collectionStats.unlocked} / {collectionStats.total} lajia</p>
              </div>
            </div>
            
            <div className="flex flex-1 max-w-xl gap-2">
              <input 
                type="text" 
                placeholder="Hae lajia..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800 text-sm"
              />
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-4 py-2 bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-[10px] uppercase tracking-widest text-emerald-900"
              >
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          
          {/* Edistymispalkki */}
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden shadow-inner border border-stone-50">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out"
              style={{ width: `${collectionStats.percent}%` }}
            />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredSpecies.map(s => {
            const stats = learningStore.getSpeciesStats(s.name);
            const isUnlocked = stats.success > 0;
            const isMastered = stats.success >= 5;
            
            const totalAttempts = stats.success + stats.error;
            const masteryRate = totalAttempts > 0 ? Math.round((stats.success / totalAttempts) * 100) : 0;

            // Käytetään kuratoitua kuvaa
            const lockedImages = curationService.getLockedImages(s.name);
            let displayImage: string | undefined;
            let fallbackImage: string | undefined;

            if (lockedImages.length > 0) {
              displayImage = lockedImages[0];
              fallbackImage = lockedImages.length > 1 ? lockedImages[1] : undefined;
            }

            return (
              <div 
                key={s.name} 
                className={`group relative bg-white rounded-[2rem] shadow-sm border transition-all duration-500 flex flex-col overflow-hidden
                  ${isUnlocked ? 'border-stone-100 hover:shadow-2xl hover:-translate-y-2' : 'border-dashed border-stone-200 opacity-60 grayscale'}
                  ${isMastered ? 'ring-4 ring-amber-400/30 border-amber-200' : ''}
                `}
              >
                <div className="aspect-square relative overflow-hidden">
                  <SafeImage 
                    src={displayImage} 
                    fallback={fallbackImage}
                    alt={s.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-stone-200/40 backdrop-blur-[2px] flex items-center justify-center">
                       <div className="bg-white/90 p-3 rounded-2xl shadow-xl transform rotate-12">
                          <span className="text-2xl">🔒</span>
                       </div>
                    </div>
                  )}

                  {isMastered && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-amber-400 text-amber-900 text-[8px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center space-x-1 uppercase tracking-tighter">
                        <span>🏆</span>
                        <span>Mestari</span>
                      </div>
                    </div>
                  )}

                  {isUnlocked && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-emerald-100 z-20">
                      <span className={`text-[8px] font-black uppercase ${masteryRate >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {masteryRate}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className={`text-[11px] font-black leading-tight uppercase tracking-tight ${isUnlocked ? 'text-emerald-900' : 'text-stone-400'}`}>
                      {isUnlocked ? s.name : '???'}
                    </h3>
                    <p className="text-[7px] text-stone-400 font-bold italic uppercase truncate">{s.latin}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-black uppercase tracking-widest text-stone-300">{s.group}</span>
                    {isUnlocked && (
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        {stats.success}✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Kultainen hehku mestareille */}
                {isMastered && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredSpecies.length === 0 && (
          <div className="py-20 text-center animate-fade-in">
            <span className="text-6xl mb-4 block">🦌</span>
            <p className="text-stone-400 font-black uppercase tracking-widest text-xs">Ei tuloksia haulla "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Encyclopedia;
