
import React, { useState, useEffect } from 'react';

interface Props {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
}

const SafeImage: React.FC<Props> = ({ src, fallback, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kun src muuttuu ulkopuolelta, resetoidaan tila
  useEffect(() => {
    setCurrentSrc(src);
    setHasFailedOnce(false);
    setLoading(true);
  }, [src]);

  const handleError = () => {
    console.warn(`Image load failed for: ${currentSrc}`);
    if (!hasFailedOnce && fallback) {
      setCurrentSrc(fallback);
      setHasFailedOnce(true);
    } else {
      // Viimeinen hätävara: täysin geneerinen metsäkuva, mutta eri lockilla jotta ei tule samaa kaikille
      const randomLock = Math.floor(Math.random() * 100);
      setCurrentSrc(`https://loremflickr.com/800/600/forest,wildlife?lock=${randomLock}`);
      setHasFailedOnce(true);
    }
  };

  return (
    <div className={`relative bg-stone-200 overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="w-8 h-8 border-4 border-emerald-900/20 border-t-emerald-900 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        key={currentSrc} // Pakotetaan DOM-elementin uudelleenlataus kun URL vaihtuu
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
    </div>
  );
};

export default SafeImage;
