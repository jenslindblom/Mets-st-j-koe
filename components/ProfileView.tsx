
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onBack: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ profile, onBack, onLogout }) => {
  const unlockedAchievements = profile.achievements.filter(a => a.unlockedAt);
  
  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-6 self-start md:self-center">
            <button onClick={onBack} className="text-emerald-800 font-black flex items-center hover:underline uppercase text-[10px] tracking-widest">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
              Takaisin
            </button>
            <button onClick={onLogout} className="text-rose-500 font-black flex items-center hover:text-rose-700 uppercase text-[10px] tracking-widest transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Kirjaudu ulos
            </button>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <h2 className="text-3xl font-black text-emerald-900 leading-none">{profile.nickname}</h2>
                <p className="text-stone-400 text-xs font-black uppercase tracking-widest mt-1">Taso {profile.level} Riistanhoitaja</p>
             </div>
             <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                {profile.nickname[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Osaamiskartta / Heatmap */}
          <div className="md:col-span-2 bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-stone-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Osaamiskartta</h3>
              <span className="text-2xl">🗺️</span>
            </div>
            <div className="space-y-6">
              {Object.keys(profile.groupStats).length > 0 ? (
                Object.entries(profile.groupStats).map(([group, stats]) => {
                  const percentage = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={group} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-stone-500">{group}</span>
                        <span className={percentage > 80 ? 'text-emerald-600' : percentage > 50 ? 'text-amber-600' : 'text-rose-600'}>
                          {percentage}% ({stats.correct}/{stats.total})
                        </span>
                      </div>
                      <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-emerald-500' : percentage > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-stone-300 font-bold italic">
                  Ei vielä dataa. Pelaa tunnistuspelejä nähdäksesi edistymisesi.
                </div>
              )}
            </div>
          </div>

          {/* Saavutukset */}
          <div className="bg-emerald-900 rounded-[3rem] shadow-xl p-8 md:p-10 text-white">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Saavutukset</h3>
            <div className="space-y-4">
              {profile.achievements.map(ach => (
                <div key={ach.id} className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ${ach.unlockedAt ? 'bg-white/10 border-white/20' : 'opacity-30 border-white/5 grayscale'}`}>
                  <div className="text-2xl">{ach.icon}</div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">{ach.title}</h4>
                    <p className="text-[10px] opacity-60 font-bold leading-tight">{ach.description}</p>
                    {ach.unlockedAt && <p className="text-[8px] text-emerald-400 mt-1 font-black uppercase">Avattu!</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">✨</div>
              <div>
                <h4 className="font-black text-emerald-900 text-lg">XP: {profile.totalPoints.toLocaleString()}</h4>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Taso {profile.level}</p>
              </div>
           </div>
           <div className="flex -space-x-2">
             {unlockedAchievements.slice(0, 5).map((a, i) => (
               <div key={i} className="w-10 h-10 bg-white border-2 border-emerald-900 rounded-full flex items-center justify-center text-lg shadow-md" title={a.title}>
                 {a.icon}
               </div>
             ))}
             {unlockedAchievements.length > 5 && (
               <div className="w-10 h-10 bg-stone-100 border-2 border-stone-200 rounded-full flex items-center justify-center text-[10px] font-black text-stone-500">
                 +{unlockedAchievements.length - 5}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
