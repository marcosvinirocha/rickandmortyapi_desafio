import EpisodesList from '@/components/episodeslist';
import FavoriteList from '@/components/favoriteList';
import { getClient } from '@/lib/apollo';
import GET_EPISODES from '@/queries/getAllEpisode';
import { EpisodesData } from '@/types/types';
export default async function Favorites() {
  const { data } = await getClient().query<EpisodesData>({
    query: GET_EPISODES,
  });
  return <FavoriteList episodes={data} />;
}
