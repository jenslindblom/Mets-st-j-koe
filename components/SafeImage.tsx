
import React, { useEffect, useState } from 'react';

interface Props {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
}

function looksLikeWrongImage(url: string): boolean {
  try {
    // Jos osoite on kuratoidusta "Special:FilePath" -lähteestä, se on todennäköisesti jo tarkistettu
    if (url.includes('Special:FilePath')) return false;

    const u = new URL(url);
    const last = decodeURIComponent(u.pathname.split('/').pop() || '').toLowerCase();
    if (!last) return false;

    // Sallitut tiedostopäätteet
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExt.some(ext => last.endsWith(ext))) return true;

    // Kielletyt kuviot, jotka viittaavat ei-valokuviin (kartat, kaaviot jne.)
    const forbiddenPatterns = [
      /\bmap\b/, /\bdistribution\b/, /\brange\b/, /\blocator\b/,
      /\bdiagram\b/, /\bchart\b/, /\bscheme\b/, /\bcoat of arms\b/,
      /\bskull\b/, /\bskeleton\b/, /\bbones\b/, /\btracks\b/,
      /\bfootprint\b/, /\bsilhouette\b/, /\btaxonomy\b/, /\batlas\b/
    ];

    // Erityistarkistus "graph"-sanalle: sallitaan "geograph" ja "photograph"
    if (last.includes('graph')) {
      const isOfficialDoc = last.includes('geograph') || last.includes('photograph');
      if (!isOfficialDoc) {
        if (/\bgraph\b/.test(last.replace(/[_-]/g, ' '))) return true;
      }
    }

    const norm = last.replace(/[_-]+/g, ' ');
    if (forbiddenPatterns.some(pattern => pattern.test(norm))) return true;

    return false;
  } catch {
    return true;
  }
}

const SafeImage: React.FC<Props> = ({ src, fallback, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const nextSrc = src || '';
    if (!nextSrc) {
      setCurrentSrc('');
      setLoading(false);
      return;
    }

    // Jos ensimmäinen kuva näyttää suodattimessa huonolta, kokeile heti varakuvaa
    if (looksLikeWrongImage(nextSrc)) {
      if (fallback && !looksLikeWrongImage(fallback)) {
        setCurrentSrc(fallback);
        setHasFailedOnce(true);
      } else {
        setCurrentSrc('');
      }
    } else {
      setCurrentSrc(nextSrc);
      setHasFailedOnce(false);
    }
    setLoading(true);
  }, [src, fallback]);

  const handleError = () => {
    // Jos pääkuva feilaa latauksessa (esim. 404 tai broken URL)
    if (!hasFailedOnce && fallback && !looksLikeWrongImage(fallback)) {
      setCurrentSrc(fallback);
      setHasFailedOnce(true);
    } else {
      setCurrentSrc('');
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-stone-200 overflow-hidden ${className || ''}`}>
      {!currentSrc ? (
        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-500 p-6 text-center text-[10px] font-black uppercase tracking-widest leading-tight">
          Ladataan tai kuvaa ei saatavilla
        </div>
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100 z-10">
              <div className="w-6 h-6 border-2 border-emerald-900/10 border-t-emerald-900 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
};

export default SafeImage;
