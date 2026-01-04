
import React, { useState, useEffect } from 'react';
import { learningStore } from '../services/learningStore';
import { UserProfile } from '../types';

interface Props {
  onComplete: (name: string) => void;
}

const ProfileSetup: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [existingProfiles, setExistingProfiles] = useState<UserProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setExistingProfiles(learningStore.getAllProfiles());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      learningStore.createProfile(trimmed);
      onComplete(trimmed);
    }
  };

  const handleSelect = (nickname: string) => {
    learningStore.setActiveProfile(nickname);
    onComplete(nickname);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-emerald-950">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 animate-scale-up border border-white/20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-5xl">🦌</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 font-serif leading-tight">Metsästäjäsimulaattori</h2>
          <p className="text-gray-500 mt-2 font-medium">Kuka lähtee tänään jahtiin?</p>
        </div>

        {existingProfiles.length > 0 && !showCreate ? (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {existingProfiles.map(p => (
                <button
                  key={p.nickname}
                  onClick={() => handleSelect(p.nickname)}
                  className="w-full p-5 bg-stone-50 border-2 border-stone-100 rounded-2xl flex items-center justify-between hover:border-emerald-500 transition-all group active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold">
                      {p.nickname[0].toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{p.nickname}</p>
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">{p.totalPoints} XP kerätty</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-stone-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="w-full py-4 border-2 border-dashed border-stone-200 text-stone-400 rounded-2xl font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all"
            >
              + Luo uusi profiili
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Uusi Metsästäjä</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nimimerkkisi"
                className="w-full px-6 py-5 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-emerald-500 focus:outline-none text-xl font-bold transition-all text-center"
                maxLength={15}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all disabled:opacity-50 active:scale-95"
              >
                Luo profiili
              </button>
              {existingProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-stone-400 font-bold text-sm hover:text-stone-600"
                >
                  Peruuta
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
