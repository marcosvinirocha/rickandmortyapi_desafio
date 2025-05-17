import React from 'react';
import { getClient } from '@/app/ApolloClient';
import GET_EPISODES from '@/queries/getAllEpisode';
import { EpisodesData } from '@/types/types';
import { Card, CardContent, CardHeader } from '@/components/card';
import { Calendar } from 'lucide-react';
import Image from 'next/image';

export default async function EpisodeDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { data } = await getClient().query<EpisodesData>({
    query: GET_EPISODES,
  });

  const filteredEpisodes = data.episodes.results.filter(
    (episode) => episode.id === id
  );
  return (
    <div className='mt-4 rounded-b-md  flex flex-row items-center justify-center w-full'>
      {filteredEpisodes.map((episode, index) => (
        <div className='flex flex-col gap-3 items-center' key={index}>
          <p className='font-bold'>{episode.name}</p>
          <p className='border-amber-300 border rounded-md p-2'>
            {episode.episode}
          </p>
          <div className='flex flex-row gap-2 items-center'>
            <Calendar /> {episode.air_date}
          </div>
          <div className='flex flex-row gap-4 flex-wrap items-center justify-center'>
            {' '}
            {/* Container pai com layout flexível em linha e espaçamento */}
            {episode.characters.map((character, index) => (
              <Card
                key={index}
                className='w-64 h-64 flex flex-col justify-between'
              >
                <CardHeader>
                  <div className='flex flex-row gap-2 flex-wrap justify-between '>
                    <p className='font-bold'>{character.name}</p>
                  </div>
                  <Image
                    src={character.image}
                    width={160}
                    height={160}
                    alt={character.name}
                  />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
