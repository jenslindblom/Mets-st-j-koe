
import React, { useState, useEffect } from 'react';
import { learningStore } from '../services/learningStore';
import { UserProfile } from '../types';
import { uiFeedback } from '../services/uiFeedbackService';

interface Props {
  onComplete: (name: string) => void;
}

const ProfileSetup: React.FC<Props> = ({ onComplete }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [existingProfiles, setExistingProfiles] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profiles = learningStore.getAllProfiles();
    setExistingProfiles(profiles);
    // Jos ei ole profiileja, ohjataan suoraan luontiin
    if (profiles.length === 0) {
      setMode('signup');
    }
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) return;

    if (learningStore.nicknameExists(trimmed)) {
      uiFeedback.playError();
      setError('Nimimerkki on jo varattu. Kirjaudu sisään tämän nimen sijaan?');
      return;
    }

    uiFeedback.playSuccess();
    learningStore.createProfile(trimmed);
    onComplete(trimmed);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) return;

    if (!learningStore.nicknameExists(trimmed)) {
      uiFeedback.playError();
      setError('Nimimerkkiä ei löytynyt. Haluatko luoda uuden?');
      return;
    }

    uiFeedback.playSuccess();
    learningStore.setActiveProfile(trimmed);
    onComplete(trimmed);
  };

  const handleSelect = (nickname: string) => {
    uiFeedback.playSuccess();
    learningStore.setActiveProfile(nickname);
    onComplete(nickname);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 md:p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-emerald-950">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 animate-scale-up border border-white/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce-slow">
            <span className="text-4xl md:text-5xl">🦌</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 font-serif leading-tight">Metsästäjäsimulaattori</h2>
          <p className="text-stone-500 mt-2 font-medium">Harjoittele kokeeseen missä vain.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => { setMode('signin'); setError(null); setName(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-emerald-900 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Kirjaudu
          </button>
          <button 
            onClick={() => { setMode('signup'); setError(null); setName(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-emerald-900 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Luo uusi
          </button>
        </div>

        {/* Mode: SIGN IN */}
        {mode === 'signin' ? (
          <div className="space-y-6 animate-fade-in">
            {existingProfiles.length > 0 ? (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Valitse profiili</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {existingProfiles.map(p => (
                    <button
                      key={p.nickname}
                      onClick={() => handleSelect(p.nickname)}
                      className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl flex items-center justify-between hover:border-emerald-500 transition-all group active:scale-95"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold">
                          {p.nickname[0].toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-stone-900">{p.nickname}</p>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">Taso {p.level}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-stone-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  ))}
                </div>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-stone-300 tracking-widest bg-white px-4">tai syötä nimimerkki</div>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Syötä nimimerkki..."
                className={`w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl focus:outline-none text-lg font-bold transition-all text-center text-stone-900 placeholder:text-stone-300 ${error ? 'border-rose-300' : 'border-stone-100 focus:border-emerald-500'}`}
              />
              {error && (
                <div className="text-center space-y-2">
                  <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight">{error}</p>
                  <button type="button" onClick={() => setMode('signup')} className="text-emerald-600 text-[10px] font-black uppercase underline">Luo uusi profiili tästä</button>
                </div>
              )}
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all disabled:opacity-30 active:scale-95"
              >
                Kirjaudu sisään
              </button>
            </form>
          </div>
        ) : (
          /* Mode: SIGN UP */
          <form onSubmit={handleCreate} className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Uusi Metsästäjä</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Valitse nimimerkki"
                className={`w-full px-6 py-5 bg-stone-50 border-2 rounded-2xl focus:outline-none text-xl font-bold transition-all text-center text-stone-900 placeholder:text-stone-300 ${error ? 'border-rose-300' : 'border-stone-100 focus:border-emerald-500'}`}
                maxLength={15}
              />
              {error && (
                <div className="text-center space-y-2">
                  <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight">{error}</p>
                  <button type="button" onClick={() => setMode('signin')} className="text-emerald-600 text-[10px] font-black uppercase underline">Palaa kirjautumiseen tästä</button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all disabled:opacity-30 active:scale-95"
              >
                Luo profiili
              </button>
              
              <p className="text-center text-stone-400 text-xs font-medium">
                Onko sinulla jo profiili?{" "}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Kirjaudu tästä
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[9px] text-stone-300 font-black uppercase tracking-[0.3em]">Metsästäjäsimulaattori v3.0</p>
        </div>
      </div>
      
      <style>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProfileSetup;
