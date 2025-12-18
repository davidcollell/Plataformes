import React, { useState, useEffect, useMemo } from 'react';
import { MediaItem, MediaStatus } from './types';
import { fetchMediaDetails } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MediaList from './components/MediaList';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import { SortIcon } from './components/icons';

type SortOption = 'recent' | 'rating' | 'year';

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('mediaWatchlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<MediaStatus>(MediaStatus.Watchlist);
  const [activeCategory, setActiveCategory] = useState<'Tots' | 'Pel·lícula' | 'Sèrie'>('Tots');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('mediaWatchlist', JSON.stringify(mediaItems));
  }, [mediaItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleAddItem = async (query: string) => {
    setIsLoading(true);
    try {
      const details = await fetchMediaDetails(query);
      
      const exists = mediaItems.some(
        (item) => item.title.toLowerCase() === details.title.toLowerCase()
      );

      if (exists) {
        showToast(`"${details.title}" ja és a la teva llista.`);
        setIsLoading(false);
        return;
      }

      let posterUrl = details.posterUrl;
      if (!posterUrl || posterUrl.trim() === '') {
         posterUrl = `https://image.pollinations.ai/prompt/movie%20poster%20key%20art%20for%20${encodeURIComponent(details.title)}%20${details.year}%20vertical%20high%20quality?width=400&height=600&nologo=true`;
      }

      let backdropUrl = details.backdropUrl;
      if (!backdropUrl || backdropUrl.trim() === '') {
        backdropUrl = `https://image.pollinations.ai/prompt/cinematic%20wide%20shot%20scene%20from%20the%20movie%20or%20show%20${encodeURIComponent(details.title)}%20${details.year}%20highly%20detailed%20masterpiece?width=800&height=450&nologo=true`;
      }

      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        ...details,
        status: MediaStatus.Watchlist,
        posterUrl: posterUrl,
        backdropUrl: backdropUrl,
      };

      setMediaItems((prev) => [newItem, ...prev]);
      showToast(`Afegit: ${newItem.title}`);
      setFilterQuery('');
    } catch (error) {
      console.error(error);
      showToast("Error en obtenir dades. Comprova el títol.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: MediaStatus) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    const statusText = newStatus === MediaStatus.Watched ? "Vist" : "Per veure";
    showToast(`Mogut a: ${statusText}`);
  };

  const handleRatingChange = (id: string, rating: number) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, userRating: rating } : item))
    );
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const item = mediaItems.find((i) => i.id === itemToDelete);
      setMediaItems((prev) => prev.filter((i) => i.id !== itemToDelete));
      setItemToDelete(null);
      if (item) showToast(`Eliminat: ${item.title}`);
    }
  };

  const filteredItems = useMemo(() => {
    let items = mediaItems.filter((item) => item.status === activeTab);
    if (activeCategory !== 'Tots') {
      items = items.filter(item => item.type === activeCategory);
    }
    if (filterQuery) {
      const query = filterQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.year.toString().includes(query) ||
        (item.platform && item.platform.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)
      );
    }
    return [...items].sort((a, b) => {
      if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });
  }, [mediaItems, activeTab, activeCategory, filterQuery, sortBy]);
  
  const watchlistCount = mediaItems.filter(i => i.status === MediaStatus.Watchlist).length;
  const watchedCount = mediaItems.filter(i => i.status === MediaStatus.Watched).length;

  const resetFilters = () => {
    setFilterQuery('');
    setActiveCategory('Tots');
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen pb-20 bg-brand-bg">
      <Header />
      <SearchForm 
        onAddItem={handleAddItem} 
        isLoading={isLoading} 
        onFilter={setFilterQuery}
        initialValue={filterQuery}
      />
      <div className="flex justify-center mt-2 border-b border-gray-800 mx-4">
        {[
          { id: MediaStatus.Watchlist, label: 'Per veure', count: watchlistCount },
          { id: MediaStatus.Watched, label: 'Vistos', count: watchedCount }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === tab.id ? 'text-brand-primary' : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
              activeTab === tab.id ? 'bg-brand-primary text-white' : 'bg-gray-800 text-gray-400'
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.5)]"></span>}
          </button>
        ))}
      </div>
      <div className="px-4 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-brand-bg/50">
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
          {['Tots', 'Pel·lícula', 'Sèrie'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="sort" className="text-gray-500 text-xs font-bold flex items-center gap-1 shrink-0">
            <SortIcon className="h-4 w-4" /> ORDENA:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="flex-grow sm:flex-grow-0 bg-brand-surface border border-gray-800 text-brand-text text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-brand-primary focus:outline-none appearance-none cursor-pointer"
          >
            <option value="recent">Recents</option>
            <option value="rating">Millor puntuació</option>
            <option value="year">Any d'estrena</option>
          </select>
        </div>
      </div>
      <MediaList
        items={filteredItems}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteRequest}
        onRatingChange={handleRatingChange}
        title={activeTab === MediaStatus.Watchlist ? "Llista de seguiment" : "Historial de visualitzacions"}
        emptyMessage={
          filterQuery || activeCategory !== 'Tots'
            ? (
              <div className="flex flex-col items-center gap-4">
                <span>No s'han trobat resultats per a la teva cerca.</span>
                <button onClick={resetFilters} className="text-brand-primary border border-brand-primary/30 px-4 py-2 rounded-lg text-sm hover:bg-brand-primary/10 transition">Neteja els filtres</button>
              </div>
            )
            : (activeTab === MediaStatus.Watchlist ? "No tens res pendent." : "Encara no has marcat res com a vist.")
        }
      />
      {itemToDelete && <ConfirmationModal itemTitle={mediaItems.find((i) => i.id === itemToDelete)?.title || ''} onConfirm={confirmDelete} onCancel={() => setItemToDelete(null)} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;