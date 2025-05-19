'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { EpisodesData } from '@/types/types';
import { Calendar, Eye, Heart, User } from 'lucide-react';
import Link from 'next/link';

interface EpisodesListProps {
  episodes: EpisodesData;
}

const FavoriteList: React.FC<EpisodesListProps> = ({ episodes }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites and watched episodes from localStorage
  useEffect(() => {
    const loadLocalStorage = (
      key: string,
      setter: (value: number[]) => void
    ) => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          setter(JSON.parse(storedData));
        } catch (error) {
          console.error(`Failed to parse stored ${key}:`, error);
          localStorage.removeItem(key);
          setter([]);
        }
      }
    };

    loadLocalStorage('favorites', setFavorites);
    loadLocalStorage('watched', setWatched);
    setHydrated(true);
  }, []);

  // Save favorites and watched episodes to localStorage
  useEffect(() => {
    const saveLocalStorage = (key: string, data: number[]) => {
      if (hydrated && (data.length > 0 || localStorage.getItem(key))) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    };

    saveLocalStorage('favorites', favorites);
    saveLocalStorage('watched', watched);
  }, [favorites, watched, hydrated]);

  // Toggle favorite status of an episode
  const toggleFavorite = (episodeId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(episodeId)
        ? prevFavorites.filter((id) => id !== episodeId)
        : [...prevFavorites, episodeId]
    );
  };

  // Toggle watched status of an episode
  const toggleWatched = (episodeId: number) => {
    setWatched((prevWatched) =>
      prevWatched.includes(episodeId)
        ? prevWatched.filter((id) => id !== episodeId)
        : [...prevWatched, episodeId]
    );
  };

  // Check if an episode is favorited
  const isFavorited = (episodeId: number): boolean => {
    return favorites.includes(episodeId);
  };

  // Check if an episode is watched
  const isWatched = (episodeId: number): boolean => {
    return watched.includes(episodeId);
  };

  // Show loading state during hydration
  if (!hydrated) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-between p-24'>
        Carregando...
      </div>
    );
  }

  // Filter episodes based on favorites
  const episodesToDisplay = episodes.episodes.results.filter((episode) =>
    favorites.includes(Number(episode.id))
  );

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {episodesToDisplay.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            isFavorited={isFavorited(Number(episode.id))}
            isWatched={isWatched(Number(episode.id))}
            toggleFavorite={() => toggleFavorite(Number(episode.id))}
            toggleWatched={() => toggleWatched(Number(episode.id))}
          />
        ))}
      </div>
    </div>
  );
};

// Extracting EpisodeCard Component for better organization
const EpisodeCard: React.FC<{
  episode: any; // Replace 'any' with the actual type of your episode data
  isFavorited: boolean;
  isWatched: boolean;
  toggleFavorite: () => void;
  toggleWatched: () => void;
}> = ({ episode, isFavorited, isWatched, toggleFavorite, toggleWatched }) => {
  return (
    <Card className='w-full h-64 flex flex-col justify-between'>
      <CardHeader className='flex flex-row gap-2 items-center flex-wrap justify-between '>
        <CardTitle>
          <Link href={`/details/${episode.id}`}> {episode.name} </Link>
        </CardTitle>
        <span className='border-amber-300 border rounded-md p-2'>
          {episode.episode}
        </span>
        <div className='flex flex-row gap-2 items-center'>
          <Button variant='ghost' onClick={toggleWatched}>
            <Eye color={isWatched ? 'blue' : '#000'} />
          </Button>
          <Button variant='ghost' onClick={toggleFavorite}>
            <Heart color={isFavorited ? 'red' : '#000'} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex flex-row gap-2 items-center justify-between'>
        <div className='flex flex-row gap-2 items-center'>
          <Calendar />
          <p>{episode.air_date}</p>
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <User />
          <p>{episode.characters.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteList;
