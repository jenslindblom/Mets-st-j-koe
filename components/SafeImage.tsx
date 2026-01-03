import React, { useState, useEffect } from 'react';

interface Props {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
}

function looksLikeWrongImage(url: string): boolean {
  try {
    const u = new URL(url);
    const last = decodeURIComponent(u.pathname.split('/').pop() || '').toLowerCase();
    if (!last) return false;

    // Jos ei ole tyypillinen rasterikuva, hylätään (svg/pdf jne.)
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExt.some(ext => last.endsWith(ext))) return true;

    // Normalisoi _ ja - välilyönneiksi helpottamaan osumia
    const norm = last.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

    // Pahimmat "ei-toivotut"
    const bad = [
      'map',
      'distribution',
      'range',
      'location map',
      'locator',
      'diagram',
      'chart',
      'graph',
      'scheme',
      'coat of arms',
      'flag',
      'logo',
      'icon',
      'emblem',
      'skull',
      'skeleton',
      'bones',
      'tracks',
      'footprint',
      'silhouette',
      'illustration',
      'drawing',
      'painting',
      'engraving',
      'etching',
      'plate',
      'atlas'
    ];

    if (bad.some(w => norm.includes(w))) return true;

    return false;
  } catch {
    return true;
  }
}

const SafeImage: React.FC<Props> = ({ src, fallback, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kun src muuttuu ulkopuolelta, resetoidaan tila
  useEffect(() => {
    if (src && looksLikeWrongImage(src)) {
      console.warn(`Rejected likely-wrong image (heuristics): ${src}`);
      if (fallback) {
        setCurrentSrc(fallback);
        setHasFailedOnce(true);
        setLoading(true);
      } else {
        setCurrentSrc('');
        setHasFailedOnce(true);
        setLoading(false);
      }
      return;
    }

    setCurrentSrc(src);
    setHasFailedOnce(false);
    setLoading(true);
  }, [src, fallback]);

  const handleError = () => {
    console.warn(`Image load failed for: ${currentSrc}`);
    if (!hasFailedOnce && fallback) {
      setCurrentSrc(fallback);
      setHasFailedOnce(true);
      setLoading(true);
    } else {
      // Ei enää satunnaisia kuvia: mieluummin rehellinen placeholder kuin väärä eläin
      setCurrentSrc('');
      setHasFailedOnce(true);
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-stone-200 overflow-hidden ${className}`}>
      {/* Placeholder jos kuva puuttuu tai ei lataudu */}
      {!currentSrc ? (
        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-600 p-6 text-center">
          Kuvaa ei saatavilla tälle lajille vielä.
        </div>
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
              <div className="w-8 h-8 border-4 border-emerald-900/20 border-t-emerald-900 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            key={currentSrc} // Pakotetaan DOM-elementin uudelleenlataus kun URL vaihtuu
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setLoading(false)}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
};

export default SafeImage;
