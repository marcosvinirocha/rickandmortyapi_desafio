'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { EpisodesData } from '@/types/types';
import { Calendar, Eye, Heart, User, Search, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type EpisodesListProps = {
  episodes: EpisodesData;
};

export default function EpisodesList({ episodes }: EpisodesListProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    {
      id: number;
      name: string;
      episode: string;
      air_date: string;
      characters: string[];
    }[]
  >([]);

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

  const handleSearch = () => {
    const filteredEpisodes = episodes.episodes.results
      .filter((episode) =>
        episode.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((episode) => ({
        ...episode,
        id: Number(episode.id),
      }));
    setSearchResults(filteredEpisodes);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  useEffect(() => {
    // Se o termo de pesquisa estiver vazio, restaura os resultados para a lista completa
    if (!searchTerm) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const displayedEpisodes =
    searchResults.length > 0 ? searchResults : episodes.episodes.results;

  if (!hydrated) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-between p-24'>
        Carregando...
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='mb-4 flex items-center space-x-2'>
        <input
          type='text'
          placeholder='Pesquisar episódio...'
          className='border rounded-md p-2'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className='w-4 h-4' />
          Pesquisar
        </Button>
        {searchTerm && (
          <Button variant='outline' onClick={clearSearch}>
            <XCircle className='w-4 h-4' />
            Limpar
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {displayedEpisodes.map((episode) => (
          <Card
            key={episode.id}
            className='w-full flex flex-col justify-between bg-card border border-border shadow-md'
          >
            <CardHeader>
              <CardTitle className='text-lg font-semibold hover:underline'>
                <Link
                  href={`/details/${episode.id}`}
                  className='text-foreground'
                >
                  {episode.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Episódio:</span>
                <span className='font-medium text-foreground border border-input rounded-md px-2 py-1'>
                  {episode.episode}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  Data:
                </span>
                <span className='font-medium text-foreground'>
                  {episode.air_date}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <User className='w-4 h-4' />
                  Personagens:
                </span>
                <span className='font-medium text-foreground'>
                  {episode.characters.length}
                </span>
              </div>
              <div className='flex justify-end gap-2 mt-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleWatched(Number(episode.id))}
                  className={cn(
                    'rounded-full',
                    isWatched(Number(episode.id))
                      ? 'text-blue-500 hover:bg-blue-500/20'
                      : 'text-gray-500 hover:text-blue-500 hover:bg-blue-500/20'
                  )}
                >
                  <Eye className='w-5 h-5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleFavorite(Number(episode.id))}
                  className={cn(
                    'rounded-full',
                    isFavorited(Number(episode.id))
                      ? 'text-red-500 hover:bg-red-500/20'
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-500/20'
                  )}
                >
                  <Heart className='w-5 h-5' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
