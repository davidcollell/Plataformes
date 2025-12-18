
import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, CloseIcon } from './icons';

interface SearchFormProps {
  onAddItem: (query: string) => void;
  isLoading: boolean;
  onFilter: (query: string) => void;
  initialValue?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onAddItem, isLoading, onFilter, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onAddItem(query.trim());
      setQuery('');
      onFilter('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value);
  };

  const handleClear = () => {
    setQuery('');
    onFilter('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2 sticky top-0 bg-brand-bg/95 backdrop-blur-lg z-20 border-b border-gray-800 transition-all duration-300">
      <div className="flex-grow relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-primary">
          <SearchIcon className="text-gray-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Cerca a la llista o afegeix un títol..."
          className="w-full bg-brand-surface border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all text-brand-text placeholder-gray-500 shadow-inner"
          disabled={isLoading}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-brand-text transition-colors"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-brand-primary hover:bg-indigo-500 active:scale-95 text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed min-w-[110px] shadow-lg shadow-brand-primary/20"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
            <span className="text-sm">Buscant...</span>
          </div>
        ) : (
          <>
            <PlusIcon />
            <span className="hidden sm:inline ml-2">Afegeix</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;