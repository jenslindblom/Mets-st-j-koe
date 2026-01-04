
import React, { useState, useEffect } from 'react';
import { learningStore } from '../services/learningStore';
import { leaderboardService, GlobalScore } from '../services/leaderboardService';

interface Props {
  onBack: () => void;
}

const Leaderboard: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'local' | 'global'>('local');
  const [globalScores, setGlobalScores] = useState<GlobalScore[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [globalType, setGlobalType] = useState<'exam' | 'matching' | 'speed'>('exam');

  const data = learningStore.getData();
  const profile = data.profile;
  const allProfiles = learningStore.getAllProfiles();

  useEffect(() => {
    if (activeTab === 'global' && leaderboardService.isEnabled()) {
      fetchGlobal();
    }
  }, [activeTab, globalType]);

  const fetchGlobal = async () => {
    setLoadingGlobal(true);
    const scores = await leaderboardService.getTopScores(globalType);
    setGlobalScores(scores);
    setLoadingGlobal(false);
  };

  if (!profile) return null;

  const sortedProfiles = [...allProfiles].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <button onClick={onBack} className="text-emerald-800 font-bold flex items-center hover:underline self-start md:self-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Takaisin
          </button>
          
          <div className="bg-stone-200 p-1.5 rounded-[1.5rem] shadow-inner flex w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('local')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.2rem] text-xs font-black transition-all ${activeTab === 'local' ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'text-stone-500 hover:text-stone-700'}`}
            >
              TÄMÄ LAITE
            </button>
            <button 
              onClick={() => setActiveTab('global')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.2rem] text-xs font-black transition-all ${activeTab === 'global' ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'text-stone-500 hover:text-stone-700'}`}
            >
              MAAILMANLISTA
            </button>
          </div>
        </div>

        {activeTab === 'local' ? (
          <div className="animate-slide-up space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center border-t-8 border-emerald-600">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Koe-ennätys</h4>
                <p className="text-5xl font-black text-emerald-900">{profile.records.exam}</p>
                <p className="text-[10px] text-stone-400 mt-2 uppercase font-bold tracking-tighter">OIKEIN / 60</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center border-t-8 border-amber-500">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Pisteet yhteensä</h4>
                <p className="text-5xl font-black text-amber-600">{profile.totalPoints.toLocaleString()}</p>
                <p className="text-[10px] text-stone-400 mt-2 uppercase font-bold tracking-tighter">XP KERÄTTY</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center border-t-8 border-blue-500">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Yhdistely</h4>
                <p className="text-5xl font-black text-blue-600">{profile.records.matching}</p>
                <p className="text-[10px] text-stone-400 mt-2 uppercase font-bold tracking-tighter">ENNATYSPISTEET</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
              <div className="bg-emerald-900 px-10 py-8 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-serif uppercase tracking-widest">Laitteen parhaat</h3>
                  <p className="text-emerald-300 text-[10px] mt-1 uppercase tracking-widest font-bold">Sinun ja ystäviesi paikallinen sijoitus</p>
                </div>
                <span className="text-3xl">📱</span>
              </div>
              
              <div className="p-4 space-y-2">
                {sortedProfiles.map((p, i) => (
                  <div key={p.nickname} className={`flex items-center justify-between p-6 rounded-2xl transition-all ${p.nickname === profile.nickname ? 'bg-emerald-50 border-2 border-emerald-200' : 'hover:bg-stone-50'}`}>
                    <div className="flex items-center space-x-6">
                      <span className="text-xl font-black w-8 text-stone-300">{i + 1}.</span>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${p.nickname === profile.nickname ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-400'}`}>
                        {p.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-black text-gray-700">{p.nickname} {p.nickname === profile.nickname && " (Sinä)"}</h5>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">Paikallinen metsästäjä</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-600">{p.totalPoints.toLocaleString()}</span>
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up space-y-8">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'exam', label: 'Koe', icon: '📝' },
                { id: 'matching', label: 'Yhdistely', icon: '🧩' },
                { id: 'speed', label: 'Pika', icon: '⚡' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setGlobalType(t.id as any)}
                  className={`px-8 py-3 rounded-2xl text-xs font-black border-2 transition-all flex items-center space-x-2 ${globalType === t.id ? 'bg-emerald-900 border-emerald-900 text-white shadow-lg scale-105' : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400'}`}
                >
                  <span>{t.icon}</span>
                  <span className="uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </div>

            {!leaderboardService.isEnabled() ? (
              <div className="bg-white border-2 border-dashed border-stone-200 p-16 rounded-[3rem] text-center shadow-xl">
                <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔗</span>
                </div>
                <h3 className="text-2xl font-black text-stone-800 mb-3 font-serif">Yhdistä maailmaan</h3>
                <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                  Globaali tulostaulu vaatii Supabase-yhteyden. Syötä URL ja API-avain palveluun nähdäksesi muiden metsästäjien tulokset.
                </p>
                <div className="inline-block p-4 bg-stone-50 rounded-xl border border-stone-100 text-[10px] text-stone-400 font-mono text-left">
                  Tiedosto: services/leaderboardService.ts<br/>
                  Aseta: SUPABASE_URL & SUPABASE_ANON_KEY
                </div>
              </div>
            ) : loadingGlobal ? (
              <div className="bg-white p-24 rounded-[3rem] shadow-xl flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-800 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">🦌</span>
                  </div>
                </div>
                <p className="mt-6 text-stone-400 font-black uppercase tracking-widest text-[10px]">Päivitetään maailmanlistaa...</p>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
                 <div className="bg-stone-900 px-10 py-8 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-serif uppercase tracking-widest">Maailman Top 10</h3>
                      <p className="text-stone-400 text-[10px] mt-1 uppercase tracking-widest font-bold">Kaikki pelaajat kategoriassa: {globalType}</p>
                    </div>
                    <span className="text-3xl">🌍</span>
                </div>
                <div className="p-4 space-y-2">
                  {globalScores.length > 0 ? globalScores.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between p-6 rounded-2xl transition-all ${s.nickname === profile.nickname ? 'bg-amber-50 border-2 border-amber-200 shadow-md z-10' : 'hover:bg-stone-50'}`}>
                      <div className="flex items-center space-x-6">
                        <span className={`text-2xl font-black w-10 flex justify-center ${i < 3 ? 'scale-125' : 'text-stone-200'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                        </span>
                        <div>
                          <h5 className={`font-black text-lg ${s.nickname === profile.nickname ? 'text-amber-900' : 'text-gray-700'}`}>
                            {s.nickname} {s.nickname === profile.nickname && "⭐"}
                          </h5>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                            {i === 0 ? 'Mestariampuja' : i < 3 ? 'Huippumetsästäjä' : 'Riistanhoitaja'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-black ${s.nickname === profile.nickname ? 'text-amber-600' : 'text-stone-900'}`}>
                          {s.score.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">PISTETTÄ</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center text-stone-300 font-bold italic flex flex-col items-center">
                      <span className="text-4xl mb-4">🍃</span>
                      Kukaan ei ole vielä kirjannut tulosta tähän kategoriaan.
                    </div>
                  )}
                </div>
                <div className="p-6 bg-stone-50 text-center border-t border-stone-100">
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Päivitetty juuri nyt • Supabase Realtime</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
