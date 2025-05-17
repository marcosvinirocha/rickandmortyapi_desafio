import { gql } from '@apollo/client';

const GET_EPISODES_BY_ID = gql`
  query GET_EPISODES_BY_ID($id: ID!) {
    episodesByIds(ids: [$id]) {
      id
      name
      episode
      air_date
      characters {
        name
      }
    }
  }
`;
export default GET_EPISODES_BY_ID;
