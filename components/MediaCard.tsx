import React, { useState, useEffect } from 'react';
import { MediaItem, MediaStatus } from '../types';
import { CheckIcon, ReplayIcon, TrashIcon, ClockIcon, TvIcon, FilmIcon, ExternalLinkIcon, StarIcon } from './icons';

interface MediaCardProps {
  item: MediaItem;
  onStatusChange: (id: string, newStatus: MediaStatus) => void;
  onDelete: (id: string) => void;
  onRatingChange: (id: string, rating: number) => void;
}

const platformDomains: { [key: string]: string } = {
  'netflix': 'netflix.com',
  'hbo max': 'max.com',
  'max': 'max.com',
  'disney+': 'disneyplus.com',
  'disney plus': 'disneyplus.com',
  'amazon prime video': 'primevideo.com',
  'prime video': 'primevideo.com',
  'apple tv+': 'tv.apple.com',
  'apple tv': 'tv.apple.com',
  'hulu': 'hulu.com',
  'peacock': 'peacocktv.com',
  'youtube premium': 'youtube.com',
  'movistar+': 'movistarplus.es',
  'movistar plus': 'movistarplus.es',
  'filmin': 'filmin.es',
  'atresplayer': 'atresplayer.com',
  'mitele': 'mitele.es',
  'rtve play': 'rtve.es',
  'skyshowtime': 'skyshowtime.com',
  'rakuten tv': 'rakuten.tv',
  'fubo': 'fubo.tv',
  'pluto tv': 'pluto.tv',
  'crunchyroll': 'crunchyroll.com',
  'paramount+': 'paramountplus.com'
};

const formatDuration = (totalMinutes: number | undefined) => {
    if (!totalMinutes) return '';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
};

const MediaCard: React.FC<MediaCardProps> = ({ item, onStatusChange, onDelete, onRatingChange }) => {
  const [showSeasons, setShowSeasons] = useState(false);
  const placeholderUrl = `https://placehold.co/400x600/1e1e1e/e5e7eb?text=${encodeURIComponent(item.title)}`;
  const backdropPlaceholder = `https://placehold.co/800x450/121212/333?text=`;
  
  const [imgSrc, setImgSrc] = useState(item.posterUrl || placeholderUrl);
  const [backdropSrc, setBackdropSrc] = useState(item.backdropUrl || backdropPlaceholder);
  const [logoErrorCount, setLogoErrorCount] = useState(0);
  
  const isWatched = item.status === MediaStatus.Watched;

  useEffect(() => {
    setImgSrc(item.posterUrl || placeholderUrl);
    setBackdropSrc(item.backdropUrl || backdropPlaceholder);
  }, [item.posterUrl, item.backdropUrl, placeholderUrl, backdropPlaceholder]);

  const handleImageError = () => {
      if (imgSrc !== placeholderUrl) setImgSrc(placeholderUrl);
  };

  const handleBackdropError = () => {
      if (backdropSrc !== backdropPlaceholder) setBackdropSrc(backdropPlaceholder);
  };

  const getPlatformDomain = () => {
    if (item.platformDomain) return item.platformDomain;
    if (!item.platform) return null;
    const normalized = item.platform.toLowerCase().trim();
    return platformDomains[normalized] || `${normalized.replace(/\s+/g, '')}.com`;
  };

  const getLogoUrl = () => {
    const domain = getPlatformDomain();
    if (!domain) return null;
    if (logoErrorCount === 0) return `https://logo.clearbit.com/${domain}?size=128`;
    if (logoErrorCount === 1) return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    return null;
  };

  const handleLogoError = () => setLogoErrorCount(prev => prev + 1);

  const logoUrl = getLogoUrl();
  const searchUrl = `https://www.google.com/search?q=veure ${encodeURIComponent(item.title)} a ${encodeURIComponent(item.platform)}`;

  return (
    <div className="bg-brand-surface rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col group border border-gray-800/50">
      
      {/* Header cinemàtic amb Imatge Representativa (Backdrop) */}
      <div className="relative aspect-video overflow-hidden">
        <img 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            src={backdropSrc} 
            alt={`Escena de ${item.title}`}
            loading="lazy"
            onError={handleBackdropError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/30"></div>
        
        {/* Etiqueta de Tipus (Overlay) */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg z-10 scale-90 group-hover:scale-100 transition-transform">
            {item.type === 'Pel·lícula' ? (
                <FilmIcon className="h-5 w-5 text-indigo-400" />
            ) : (
                <TvIcon className="h-5 w-5 text-purple-400" />
            )}
        </div>
      </div>
      
      <div className="p-4 pt-0 flex flex-col flex-grow relative">
        
        {/* Pòster vertical superposat */}
        <div className="flex gap-4 -mt-16 sm:-mt-20 relative z-10 mb-4">
          <div className="w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-brand-surface bg-brand-bg shrink-0">
             <img 
                src={imgSrc} 
                alt={item.title} 
                className="w-full h-full object-cover"
                onError={handleImageError}
             />
          </div>
          <div className="pt-16 sm:pt-20 flex-grow">
            <h3 className="text-xl font-bold text-brand-text leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">{item.title}</h3>
            <p className="text-sm font-semibold text-brand-primary/80 mt-1">{item.year}</p>
          </div>
        </div>
        
        <div className="mb-4 flex flex-wrap items-center gap-2">
            {item.platform && item.platform !== 'No disponible' && (
                <div className="flex items-center gap-2">
                  {logoUrl ? (
                    <a 
                        href={searchUrl} target="_blank" rel="noopener noreferrer"
                        className="relative p-0.5 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center h-8 w-8 border border-gray-200 hover:scale-110 transition-transform"
                        title={`Obrir ${item.platform}`}
                    >
                        <img src={logoUrl} alt={item.platform} className="max-h-full max-w-full object-contain" onError={handleLogoError} />
                    </a>
                  ) : (
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-gray-800 text-gray-300 px-3 py-1 font-bold hover:bg-gray-700 hover:text-white transition-all border border-gray-700 text-[10px]">
                        {item.platform} <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
            )}
            
            {item.type === 'Pel·lícula' && item.duration && (
                <span className="inline-flex items-center rounded-full bg-blue-600/10 text-blue-300 border border-blue-600/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                    <ClockIcon className="h-3 w-3 mr-1" /> {formatDuration(item.duration)}
                </span>
            )}
            
            {item.type === 'Sèrie' && item.seasons && (
                <button 
                    onClick={() => setShowSeasons(!showSeasons)}
                    className={`inline-flex items-center rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider transition-all ${
                        showSeasons ? 'bg-teal-500 text-white' : 'bg-teal-600/10 text-teal-300 border border-teal-600/20'
                    }`}
                >
                    <TvIcon className="h-3 w-3 mr-1" /> {item.seasons} {item.seasons > 1 ? 'temporades' : 'temporada'}
                </button>
            )}
        </div>
        
        {showSeasons && item.type === 'Sèrie' && (
            <div className="mb-4 p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-sm animate-fade-in shadow-inner">
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    {item.episodesPerSeason?.map((count, index) => (
                        <div key={index} className="bg-brand-surface p-1.5 rounded-lg text-center border border-gray-800">
                            <span className="block text-[8px] font-black text-gray-500 mb-1">T{index + 1}</span>
                            <span className="block font-bold text-xs text-brand-text">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <p className="text-brand-text-muted text-sm flex-grow line-clamp-2 mb-4 leading-relaxed italic border-l-2 border-brand-primary/20 pl-3">
            {item.description}
        </p>
        
        {/* Rating Section */}
        <div className="flex items-center justify-between mb-4 bg-gray-800/20 p-2 rounded-xl border border-gray-800/40">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                      key={star} onClick={() => onRatingChange(item.id, star)}
                      className="focus:outline-none transition-transform hover:scale-125 active:scale-90"
                  >
                      <StarIcon filled={(item.userRating || 0) >= star} className={`h-4 w-4 ${ (item.userRating || 0) >= star ? 'text-yellow-400' : 'text-gray-700' }`} />
                  </button>
              ))}
            </div>
            <span className="text-[10px] font-black text-gray-500">
              {item.userRating ? `${item.userRating}/5` : 'Sense vot'}
            </span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-800/50 flex justify-between items-center gap-2">
          {isWatched ? (
            <button onClick={() => onStatusChange(item.id, MediaStatus.Watchlist)} className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-gray-800 hover:bg-gray-700 text-brand-text py-2 rounded-xl transition-all border border-gray-700">
              <ReplayIcon /> <span>Tornar a veure</span>
            </button>
          ) : (
            <button onClick={() => onStatusChange(item.id, MediaStatus.Watched)} className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-brand-primary hover:bg-brand-primary/90 text-white py-2 rounded-xl transition-all shadow-lg shadow-brand-primary/20">
              <CheckIcon /> <span>Vist</span>
            </button>
          )}
          <button onClick={() => onDelete(item.id)} className="text-gray-600 hover:text-red-400 p-2 rounded-xl bg-gray-800/30 hover:bg-red-500/10 transition-all border border-gray-800 hover:border-red-400/20">
            <TrashIcon />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MediaCard;