'use client';
import { Eye, Heart } from 'lucide-react';
import React from 'react';

type FavoriteProps = {
  id: number | string;
  favorited: boolean;
  setFavorited: (id: number | string) => void;
};

export default function favorite({
  id,
  favorited,
  setFavorited,
}: FavoriteProps) {
  return (
    <div className='flex flex-row gap-2 items-center'>
      <Eye
        color={favorited ? 'red' : '#000'}
        size='20'
        onClick={() => setFavorited(id)}
      />
      <Heart />
    </div>
  );
}
