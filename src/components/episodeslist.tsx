'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { EpisodesData } from '@/types/types';
import { Calendar, Eye, Heart, User } from 'lucide-react';
import Link from 'next/link';

type EpisodesListProps = {
  episodes: EpisodesData;
};

export default function EpisodesList({ episodes }: EpisodesListProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Carrega os favoritos do localStorage ao montar o componente
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse stored favorites:', error);
        // Se houver um erro ao analisar, considere limpar o localStorage ou defina como um array vazio
        localStorage.removeItem('favorites');
        setFavorites([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Carrega os Assistidos do localStorage ao montar o componente

    const storedWatched = localStorage.getItem('watched');
    if (storedWatched) {
      try {
        setWatched(JSON.parse(storedWatched));
      } catch (error) {
        console.error('Failed to parse stored watched:', error);
        // Se houver um erro ao analisar, considere limpar o localStorage ou defina como um array vazio
        localStorage.removeItem('watched');
        setWatched([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Salva os favoritos no localStorage sempre que a lista de favoritos mudar
    if (
      hydrated &&
      (favorites.length > 0 || localStorage.getItem('favorites'))
    ) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, hydrated]);

  useEffect(() => {
    // Salva os assistidos no localStorage sempre que a lista de assistidos mudar
    if (hydrated && (watched.length > 0 || localStorage.getItem('watched'))) {
      localStorage.setItem('watched', JSON.stringify(watched));
    }
  }, [watched, hydrated]);

  const toggleFavorite = (episodeId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(episodeId)) {
        // Remove o episódio dos favoritos
        return prevFavorites.filter((id) => id !== episodeId);
      } else {
        // Adiciona o episódio aos favoritos
        return [...prevFavorites, episodeId];
      }
    });
  };

  const toggleWatched = (episodeId: number) => {
    setWatched((prevWatched) => {
      if (prevWatched.includes(episodeId)) {
        // Remove o episódio dos assistidos
        return prevWatched.filter((id) => id !== episodeId);
      } else {
        // Adiciona o episódio aos assistidos
        return [...prevWatched, episodeId];
      }
    });
  };

  const isFavorited = (episodeId: number) => {
    return favorites.includes(episodeId);
  };

  const isWatched = (episodeId: number) => {
    return watched.includes(episodeId);
  };

  if (!hydrated) {
    // Renderiza um estado de carregamento enquanto o componente está sendo hidratado
    return (
      <div className='flex min-h-screen flex-col items-center justify-between p-24'>
        Carregando...
      </div>
    ); // Ou um componente de carregamento mais adequado
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {episodes.episodes.results.map((episode) => (
          <Card
            key={episode.id}
            className='w-full h-64 flex flex-col justify-between'
          >
            <CardHeader className='flex flex-row gap-2 items-center flex-wrap justify-between '>
              <CardTitle>
                <Link href={`/details/${episode.id}`}> {episode.name} </Link>
              </CardTitle>
              <span className='border-amber-300 border rounded-md p-2'>
                {episode.episode}
              </span>
              <div className='flex flex-row gap-2 items-center'>
                <Button
                  variant='ghost'
                  onClick={() => toggleWatched(Number(episode.id))}
                >
                  <Eye
                    color={isWatched(Number(episode.id)) ? 'blue' : '#000'}
                  />
                </Button>

                <Button
                  variant='ghost'
                  onClick={() => toggleFavorite(Number(episode.id))}
                >
                  <Heart
                    color={isFavorited(Number(episode.id)) ? 'red' : '#000'}
                  />
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
        ))}
      </div>
    </div>
  );
}
