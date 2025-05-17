import { getClient } from './ApolloClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { EpisodesData } from '@/types/types';
import GET_EPISODES from '@/queries/getAllEpisode';
import { Calendar, Heart, User } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const { data } = await getClient().query<EpisodesData>({
    query: GET_EPISODES,
  });

  const handleClick = () => {
    console.log('Button clicked!');
    // Add your desired logic here
  };
  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {data.episodes.results.map((episode) => (
          <Card
            key={episode.id}
            className='w-full h-64 flex flex-col justify-between'
          >
            <CardHeader className='flex flex-row gap-2 flex-wrap justify-between '>
              <CardTitle>
                <Link href={`/details/${episode.id}`}> {episode.name} </Link>
              </CardTitle>
              <span className='border-amber-300 border rounded-md p-2'>
                {episode.episode}
              </span>
            </CardHeader>
            <CardContent className='flex flex-row gap-2 items-center justify-between'>
              <Calendar />
              <p>{episode.air_date}</p>
              <User />
              <p>{episode.characters.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
