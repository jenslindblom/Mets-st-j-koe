
import React, { useState, useEffect, useMemo } from 'react';
import { SPECIES_DB } from '../constants';
import { curationService } from '../services/curationService';
import { fetchCategoryFiles, searchCommonsFiles, buildFilePathUrl } from '../services/commonsImages';

interface Props {
  onBack: () => void;
}

const CurationTool: React.FC<Props> = ({ onBack }) => {
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState(0);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lockedData, setLockedData] = useState(curationService.getCuratedImages());
  const [searchQuery, setSearchQuery] = useState('');

  const species = SPECIES_DB[selectedSpeciesIndex];
  
  const stats = useMemo(() => {
    const total = SPECIES_DB.length;
    const curatedCount = Object.keys(lockedData).length;
    const totalImages = Object.values(lockedData).reduce((acc, curr) => acc + curr.length, 0);
    return { total, curatedCount, totalImages, percent: Math.round((curatedCount / total) * 100) };
  }, [lockedData]);

  // Lataa automaattisesti kategoriasta kun laji vaihtuu
  useEffect(() => {
    const loadFromCategory = async () => {
      setCandidates([]);
      if (!species.commonsCategory) return;
      
      setLoading(true);
      const files = await fetchCategoryFiles(species.commonsCategory);
      if (files.length > 0) {
        setCandidates(files.map(f => buildFilePathUrl(f, 600)));
      } else {
        // Jos kategoria on tyhjä, kokeillaan suoraan tieteellisellä nimellä hakua
        const searchFiles = await searchCommonsFiles(species.latin);
        setCandidates(searchFiles.map(f => buildFilePathUrl(f, 600)));
      }
      setLoading(false);
      setSearchQuery(''); // Nollaa manuaalinen haku
    };
    loadFromCategory();
  }, [species]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    const files = await searchCommonsFiles(searchQuery);
    setCandidates(files.map(f => buildFilePathUrl(f, 600)));
    setLoading(false);
  };

  const handleToggle = (url: string) => {
    curationService.toggleImage(species.name, url);
    setLockedData(curationService.getCuratedImages());
  };

  const handleClear = () => {
    curationService.removeSpecies(species.name);
    setLockedData(curationService.getCuratedImages());
  };

  const handleExport = () => {
    const json = curationService.exportAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metsastaja_curation_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const currentLocked = lockedData[species.name] || [];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      <nav className="bg-stone-800 border-b border-stone-700 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-stone-700 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Pro-Kuraattori v3</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <div className="h-2 w-48 bg-stone-700 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 transition-all" style={{ width: `${stats.percent}%` }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-stone-400">
              {stats.curatedCount}/{stats.total} LAJIA ({stats.totalImages} KUVAA)
            </p>
          </div>
          <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg transition-all">
            Lataa JSON
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 sm:w-80 bg-stone-800 border-r border-stone-700 overflow-y-auto custom-scrollbar">
          {SPECIES_DB.map((s, idx) => {
            const count = (lockedData[s.name] || []).length;
            return (
              <button 
                key={s.name}
                onClick={() => setSelectedSpeciesIndex(idx)}
                className={`w-full p-4 text-left border-b border-stone-700 transition-colors flex items-center justify-between group ${selectedSpeciesIndex === idx ? 'bg-emerald-900/40' : 'hover:bg-stone-700/50'}`}
              >
                <div>
                  <p className={`text-xs font-black uppercase leading-none ${selectedSpeciesIndex === idx ? 'text-emerald-400' : 'text-stone-300'}`}>{s.name}</p>
                  <p className="text-[9px] text-stone-500 font-bold mt-1 uppercase tracking-tighter">{s.group}</p>
                </div>
                {count > 0 && (
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-800 pb-8 gap-4">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">{species.name}</h2>
                <p className="text-emerald-400 italic text-base mt-1">{species.latin} • {species.group}</p>
              </div>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button 
                  onClick={() => setSelectedSpeciesIndex(i => Math.max(0, i - 1))}
                  className="flex-1 sm:flex-none px-6 py-3 bg-stone-800 rounded-xl hover:bg-stone-700 font-bold text-xs uppercase tracking-widest"
                >
                  Edellinen
                </button>
                <button 
                  onClick={() => setSelectedSpeciesIndex(i => Math.min(SPECIES_DB.length - 1, i + 1))}
                  className="flex-1 sm:flex-none px-6 py-3 bg-stone-800 rounded-xl hover:bg-stone-700 font-bold text-xs uppercase tracking-widest"
                >
                  Seuraava
                </button>
              </div>
            </header>

            {/* Selected Images Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Valitut kuvat ({currentLocked.length})</h3>
                  <p className="text-stone-500 text-[10px] mt-1">Nämä kuvat arvotaan peliin.</p>
                </div>
                {currentLocked.length > 0 && (
                  <button onClick={handleClear} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Tyhjennä kaikki</button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {currentLocked.map((url, i) => (
                  <div key={i} className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleToggle(url)}
                      className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <span className="text-[10px] font-black uppercase">Poista</span>
                    </button>
                  </div>
                ))}
                {currentLocked.length === 0 && (
                  <div className="w-full py-10 border-2 border-dashed border-stone-800 rounded-[2rem] flex flex-col items-center justify-center text-stone-600">
                    <span className="text-3xl mb-2">📸</span>
                    <p className="text-[10px] font-black uppercase">Ei vielä valintoja</p>
                  </div>
                )}
              </div>
            </section>

            {/* Candidates & Search Section */}
            <section className="space-y-6 pt-10 border-t border-stone-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Ehdokkaat Commonsista</h3>
                
                <form onSubmit={handleManualSearch} className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Etsi muilla hakusanoilla..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 md:w-64 px-4 py-2 bg-stone-800 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-stone-700"
                  />
                  <button type="submit" className="px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-xs font-black uppercase tracking-widest transition-colors">
                    Hae
                  </button>
                </form>
              </div>
              
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-emerald-500">
                  <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Etsitään kuvia...</p>
                </div>
              ) : candidates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {candidates.map((url, i) => {
                    const isSelected = currentLocked.includes(url);
                    return (
                      <div 
                        key={i} 
                        className={`group relative aspect-square bg-stone-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-emerald-500 scale-95 opacity-50' : 'hover:ring-4 ring-stone-500 hover:scale-105 shadow-lg'}`}
                        onClick={() => handleToggle(url)}
                      >
                        <img src={url} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500/20' : 'bg-black/0 group-hover:bg-black/40'}`}>
                           {isSelected ? (
                             <div className="bg-emerald-500 p-2 rounded-full shadow-xl">
                               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                             </div>
                           ) : (
                             <button className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">Lisää peliin</button>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-20 text-center bg-stone-800/30 rounded-[3rem] border-2 border-dashed border-stone-800">
                  <p className="text-stone-600 text-sm italic mb-4">Ei tuloksia haulla "{searchQuery || species.commonsCategory || species.latin}".</p>
                  <button 
                    onClick={() => {
                      const fallback = species.name + " animal portrait";
                      setSearchQuery(fallback);
                      searchCommonsFiles(fallback).then(files => setCandidates(files.map(f => buildFilePathUrl(f, 600))));
                    }}
                    className="px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Kokeile hakea: "{species.name} animal portrait"
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </div>
  );
};

export default CurationTool;
