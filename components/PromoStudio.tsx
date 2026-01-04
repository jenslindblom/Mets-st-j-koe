
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SPECIES_DB } from '../constants';

interface Props {
  onBack: () => void;
}

const PromoStudio: React.FC<Props> = ({ onBack }) => {
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_DB[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const checkAndOpenKey = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const generatePromo = async () => {
    await checkAndOpenKey();
    setIsGenerating(true);
    setVideoUrl(null);
    setStatus('Suunnitellaan elokuvallista kohtausta...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A cinematic, high-quality professional wildlife shot of a ${selectedSpecies.en} (${selectedSpecies.latin}) in its natural habitat, a misty Finnish forest during golden hour. Soft lighting, 4k detail, national geographic style.`;
      
      setStatus('Generoidaan videota (Veo 3.1)... Tämä voi kestää minuutin.');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        setStatus('Käsitellään videoruutuja... Melkein valmista.');
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("not found")) {
        setStatus("Virhe: API-avainta ei löytynyt tai se on virheellinen. Valitse avain uudelleen.");
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        setStatus('Videon generointi epäonnistui. Yritä uudelleen.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-6 md:p-12 animate-fade-in overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={onBack} className="p-3 bg-stone-900 rounded-full hover:bg-stone-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-emerald-400">Promo Studio</h1>
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Luo markkinointimateriaalia Veo 3.1:llä</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-stone-600 font-black uppercase mb-1">Vaatii maksullisen API-avaimen</p>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-emerald-600 text-[10px] font-bold hover:underline uppercase tracking-widest">Lue laskutuksesta</a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Controls */}
          <div className="space-y-8 bg-stone-900/50 p-8 rounded-[3rem] border border-stone-800 h-fit">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Valitse laji</label>
              <select 
                value={selectedSpecies.name}
                onChange={(e) => setSelectedSpecies(SPECIES_DB.find(s => s.name === e.target.value) || SPECIES_DB[0])}
                className="w-full bg-stone-800 border border-stone-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {SPECIES_DB.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Formaatti</label>
              <div className="flex bg-stone-800 p-1 rounded-2xl">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${aspectRatio === '16:9' ? 'bg-emerald-600 text-white' : 'text-stone-500'}`}
                >
                  Vaaka (16:9)
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${aspectRatio === '9:16' ? 'bg-emerald-600 text-white' : 'text-stone-500'}`}
                >
                  Pysty (9:16)
                </button>
              </div>
            </div>

            <button 
              onClick={generatePromo}
              disabled={isGenerating}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : <span>🎬 Generoi mainos</span>}
            </button>
            
            {status && <p className="text-[10px] text-center text-emerald-500 font-bold uppercase tracking-tight animate-pulse">{status}</p>}
          </div>

          {/* Preview Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`relative bg-stone-900 rounded-[3rem] overflow-hidden border border-stone-800 shadow-2xl flex items-center justify-center ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[700px] mx-auto'}`}>
              {videoUrl ? (
                <div className="relative w-full h-full">
                  <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                  
                  {/* Overlay UI elements to show "Look & Feel" */}
                  <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="bg-emerald-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Metsästäjäsimulaattori</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                        <span className="text-xl">🏆</span>
                      </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl max-w-xs animate-slide-up">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">🦌</div>
                        <div>
                          <h4 className="text-stone-900 font-black text-sm uppercase leading-none">{selectedSpecies.name}</h4>
                          <p className="text-stone-400 text-[8px] font-bold uppercase mt-1 italic">{selectedSpecies.latin}</p>
                        </div>
                      </div>
                      <p className="text-stone-600 text-[10px] font-medium leading-relaxed">
                        {selectedSpecies.info.slice(0, 100)}...
                      </p>
                      <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                         <span className="text-[8px] font-black uppercase text-emerald-600">Laji Löydetty!</span>
                         <span className="text-xs">🏆</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <span className="text-6xl block mb-6 grayscale opacity-20">🎥</span>
                  <p className="text-stone-600 font-black uppercase tracking-widest text-xs">Videon esikatselu ilmestyy tähän</p>
                </div>
              )}
            </div>
            
            <p className="text-center text-stone-600 text-[10px] font-medium uppercase tracking-[0.2em]">
              Tämä esikatselu näyttää, kuinka aito UI yhdistyy tekoälyn luomaan videoon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoStudio;
