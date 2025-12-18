
import React from 'react';
import { MediaItem, MediaStatus } from '../types';
import MediaCard from './MediaCard';

interface MediaListProps {
  items: MediaItem[];
  onStatusChange: (id: string, newStatus: MediaStatus) => void;
  onDelete: (id: string) => void;
  onRatingChange: (id: string, rating: number) => void;
  title: string;
  emptyMessage: string;
}

const MediaList: React.FC<MediaListProps> = ({ items, onStatusChange, onDelete, onRatingChange, title, emptyMessage }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-brand-text-muted">{title}</h2>
      {items.length === 0 ? (
        <div className="text-center py-10 px-4 bg-brand-surface rounded-lg">
          <p className="text-brand-text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              onStatusChange={onStatusChange} 
              onDelete={onDelete} 
              onRatingChange={onRatingChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaList;