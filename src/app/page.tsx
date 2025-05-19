import EpisodesList from '@/components/episodeslist';
import { getClient } from '@/lib/apollo';
import GET_EPISODES from '@/queries/getAllEpisode';
import { EpisodesData } from '@/types/types';

export default async function Home() {
  const { data } = await getClient().query<EpisodesData>({
    query: GET_EPISODES,
  });
  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <EpisodesList episodes={data} />
    </div>
  );
}
